import React, {
  createContext,
  useState,
  useMemo,
  useContext,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import {
  fetchFlightOffers,
  createCancelToken,
} from "../services/flights/duffelApi";

export const FlightsContext = createContext({
  filters: {
    stops: { direct: true, oneStop: true, twoPlus: true },
    // other filters...
  },
  updateFilter: () => {},
});

export function FlightsProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [after, setAfter] = useState(null);
  const [offers, setOffers] = useState([]);
  const [offersByBest, setOffersByBest] = useState([]);
  const [offersByPrice, setOffersByPrice] = useState([]);
  const [offersByDuration, setOffersByDuration] = useState([]);
  const [filters, setFilters] = useState({
    stops: [0, 1, 2], // All options selected by default
    // other filters...
  });

  const cancelTokenSource = useRef(null);

  const fetchAttempts = useRef(0);
  const fetchTimeout = useRef(null);

  console.log("FlightsProvider - filters:", filters);

  const [sortingMethod, setSortingMethod] = useState("best");
  const [hasReceivedFirstPage, setHasReceivedFirstPage] = useState(false);
  const [searchComplete, setSearchComplete] = useState(false);
  const {
    origin,
    destination,
    dates: { outbound, inbound },
    travelClass,
    passengers: { adults, children: kids, infants },
  } = useSelector((state) => state.flight);
  const uniqueFlights = useRef(new Set());

  const sortByBest = (a, b) => {
    // Calculate min and max for normalization
    const allOffers = [...offers];
    const minPrice = Math.min(...allOffers.map((offer) => offer.total_amount));
    const maxPrice = Math.max(...allOffers.map((offer) => offer.total_amount));
    const minDuration = Math.min(...allOffers.map(calculateDuration));
    const maxDuration = Math.max(...allOffers.map(calculateDuration));
    const minStops = Math.min(...allOffers.map(calculateStops));
    const maxStops = Math.max(...allOffers.map(calculateStops));

    // Calculate score for each offer
    const aScore = calculateScore(
      a,
      minPrice,
      maxPrice,
      minDuration,
      maxDuration,
      minStops,
      maxStops
    );
    const bScore = calculateScore(
      b,
      minPrice,
      maxPrice,
      minDuration,
      maxDuration,
      minStops,
      maxStops
    );

    // Return comparison of scores
    return aScore - bScore;
  };

  const sortByPrice = (a, b) => a.total_amount - b.total_amount;

  const sortByDuration = (a, b) => {
    const calculateTotalDuration = (offer) => {
      let totalDuration = 0;
      offer.slices.forEach((slice) => {
        const departureTime = new Date(slice.segments[0].departing_at);
        const arrivalTime = new Date(
          slice.segments[slice.segments.length - 1].arriving_at
        );
        const duration = (arrivalTime - departureTime) / (1000 * 60); // Duration in minutes
        totalDuration += duration;
      });
      return totalDuration;
    };

    const aTotalDuration = calculateTotalDuration(a);
    const bTotalDuration = calculateTotalDuration(b);

    return aTotalDuration - bTotalDuration;
  };

  function mergeSortedArrays(arr1, arr2, comparisonFunction) {
    const merged = [];
    let index1 = 0;
    let index2 = 0;

    while (index1 < arr1.length && index2 < arr2.length) {
      // Compare elements from arr1 and arr2 and push the smaller one into the merged array
      if (comparisonFunction(arr1[index1], arr2[index2]) < 0) {
        merged.push(arr1[index1]);
        index1++;
      } else {
        merged.push(arr2[index2]);
        index2++;
      }
    }

    // If there are remaining elements in arr1 or arr2, push them into the merged array
    while (index1 < arr1.length) {
      merged.push(arr1[index1]);
      index1++;
    }
    while (index2 < arr2.length) {
      merged.push(arr2[index2]);
      index2++;
    }

    return merged;
  }

  const calculateDuration = (offer) => {
    let totalDuration = 0;
    offer.slices.forEach((slice) => {
      const departureTime = new Date(slice.segments[0].departing_at);
      const arrivalTime = new Date(
        slice.segments[slice.segments.length - 1].arriving_at
      );
      const duration = (arrivalTime - departureTime) / (1000 * 60); // Duration in minutes
      totalDuration += duration;
    });
    return totalDuration;
  };

  const calculateStops = (offer) => {
    let totalStops = 0;
    offer.slices.forEach((slice) => {
      totalStops += slice.segments ? slice.segments.length : 0;
    });
    return totalStops;
  };

  const calculateScore = (
    offer,
    minPrice,
    maxPrice,
    minDuration,
    maxDuration,
    minStops,
    maxStops
  ) => {
    // Normalize values
    const normalizedPrice =
      (offer.total_amount - minPrice) / (maxPrice - minPrice);
    const normalizedDuration =
      (calculateDuration(offer) - minDuration) / (maxDuration - minDuration);
    const normalizedStops =
      (calculateStops(offer) - minStops) / (maxStops - minStops);

    // Calculate score
    return (
      0.5 * normalizedPrice + 0.3 * normalizedDuration + 0.2 * normalizedStops
    );
  };

  const updateFilter = useCallback((name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const getFilteredAndSortedOffers = (offers, filters, sortingMethod) => {
    // Apply filters
    const filteredOffers = offers.filter((offer) => {
      const totalStops = calculateStops(offer); // Rename "stops" to "totalStops"
      return filters.stops.includes(totalStops);
    });

    let sortFunction;
    switch (sortingMethod) {
      case "best":
        sortFunction = sortByBest;
        break;
      case "price":
        sortFunction = sortByPrice;
        break;
      case "duration":
        sortFunction = sortByDuration;
        break;
      default:
        console.warn(`Unknown sorting method: ${sortingMethod}`);
        sortFunction = sortByBest; // Default to best if unknown method is provided
    }

    // Apply sorting
    const sortedOffers = filteredOffers.sort(sortFunction);

    return sortedOffers;
  };

  // Use the getFilteredAndSortedOffers function to get the filtered and sorted offers
  const sortedOffers = useMemo(() => {
    return getFilteredAndSortedOffers(offers, filters, sortingMethod);
  }, [offers, filters, sortingMethod]);

  const isSimilarOffer = (newOffer, existingOffers) => {
    return existingOffers.some((existingOffer) => {
      // Check total_amount
      const sameTotalAmount =
        newOffer.total_amount === existingOffer.total_amount;

      // Check the owner's iata_code
      const sameIataCode =
        newOffer.owner.iata_code === existingOffer.owner.iata_code;

      // Check durations of the first and last segments of each slice
      const hasSameSegmentDurations = newOffer.slices.every(
        (slice, sliceIndex) => {
          if (existingOffer.slices[sliceIndex]) {
            const newFirstSegmentDuration = slice.segments[0].duration;
            const newLastSegmentDuration =
              slice.segments[slice.segments.length - 1].duration;

            const existingFirstSegmentDuration =
              existingOffer.slices[sliceIndex].segments[0].duration;
            const existingLastSegmentDuration =
              existingOffer.slices[sliceIndex].segments[
                existingOffer.slices[sliceIndex].segments.length - 1
              ].duration;

            return (
              newFirstSegmentDuration === existingFirstSegmentDuration &&
              newLastSegmentDuration === existingLastSegmentDuration
            );
          }
          return false; // If there's no matching slice index in the existing offer, they're not the same
        }
      );

      const isSimilar =
        sameTotalAmount && sameIataCode && hasSameSegmentDurations;
      if (isSimilar) {
        console.log("Similar Offers:", newOffer, existingOffer);
      }

      return isSimilar;
    });
  };

  const isMounted = useRef(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fetchFlightOffersPage = useCallback(
    async (after) => {
      if (fetchAttempts.current >= 10) {
        console.log("Max fetch attempts reached. Stopping further requests.");
        return;
      }
      try {
        const flightOffers = await fetchFlightOffers({
          origin,
          destination,
          outbound,
          inbound,
          travelClass,
          adults,
          kids,
          infants,
          after,
        });

        const { results } = flightOffers;
        const newOffers = results.data || [];
        const newAfter = results.meta.after || null;

        // Filter out offers with "ZZ" iata_code and offers that already exist in the state
        const uniqueNewOffers = newOffers.filter((offer) => {
          return offer.owner.iata_code !== "ZZ";
        });

        const filteredNewOffers = uniqueNewOffers.filter((newOffer) => {
          return !isSimilarOffer(newOffer, offers); // This checks if the new offer is not similar to any of the existing offers.
        });

        const newOffersSortedByBest = [...filteredNewOffers].sort(sortByBest);
        const newOffersSortedByPrice = [...filteredNewOffers].sort(sortByPrice);
        const newOffersSortedByDuration = [...filteredNewOffers].sort(
          sortByDuration
        );

        setOffersByBest((prevOffers) =>
          mergeSortedArrays(prevOffers, newOffersSortedByBest, sortByBest)
        );
        setOffersByPrice((prevOffers) =>
          mergeSortedArrays(prevOffers, newOffersSortedByPrice, sortByPrice)
        );
        setOffersByDuration((prevOffers) =>
          mergeSortedArrays(
            prevOffers,
            newOffersSortedByDuration,
            sortByDuration
          )
        );

        setOffers((prevOffers) => [...prevOffers, ...filteredNewOffers]); // Use filtered offers here
        setAfter(newAfter);

        if (!newAfter && !hasReceivedFirstPage) {
          setHasReceivedFirstPage(true);
          setIsLoading(false);
        }

        if (newAfter && isMounted.current) {
          fetchTimeout.current = setTimeout(() => {
            fetchFlightOffersPage(newAfter);
          }, 1200);
        }
      } catch (error) {
        console.error("Error:", error);
      }
      fetchAttempts.current += 1;
    },
    [offers, filters, fetchFlightOffers]
  );

  const clearFlightSearchData = useCallback(() => {
    setOffers([]);
    setOffersByBest([]);
    setOffersByPrice([]);
    setOffersByDuration([]);
    setAfter(null);
  }, []);

  // Reference to track initial render
  const initialRender = useRef(true);

  const handleRouteChange = () => {
    console.log("Cleaning up FlightsProvider...");
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel();
      cancelTokenSource.current = createCancelToken();
    }
    if (fetchTimeout.current) {
      clearTimeout(fetchTimeout.current);
    }
    fetchAttempts.current = 0; // Reset the fetch attempts
    isMounted.current = true; // Reset the isMounted ref to true for a new search
    setHasReceivedFirstPage(false); // Reset this state
  };

  useEffect(() => {
    if (initialRender.current) {
      // If it's the initial render, just mark it as done and return
      initialRender.current = false;
      return;
    }
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel();
    }
  }, [router.route]);

  useEffect(() => {
    handleRouteChange();
  }, [pathname, searchParams]);

  const flightContextValue = useMemo(
    () => ({
      isLoading,
      hasReceivedFirstPage,
      offers,
      offersByBest,
      offersByPrice,
      offersByDuration,
      fetchFlightOffers,
      fetchFlightOffersPage,
      setIsLoading,
      setHasReceivedFirstPage,
      setOffers,
      setOffersByBest,
      setOffersByPrice,
      setOffersByDuration,
      clearFlightSearchData,
      fetchAttempts,
      after,
      isSimilarOffer,
    }),
    [
      isLoading,
      setIsLoading,
      offersByBest,
      offersByPrice,
      offersByDuration,
      sortedOffers,
      fetchFlightOffersPage,
      setAfter,
      setHasReceivedFirstPage,
      clearFlightSearchData,
      updateFilter,
      filters,
      after,
    ]
  );

  return (
    <FlightsContext.Provider value={flightContextValue}>
      {children}
    </FlightsContext.Provider>
  );
}

export function useFlights() {
  const context = useContext(FlightsContext);

  if (!context) {
    throw new Error("useFlights must be used within a FlightsProvider");
  }

  return context;
}
