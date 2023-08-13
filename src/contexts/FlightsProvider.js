import React, {
  createContext,
  useState,
  useMemo,
  useContext,
  useRef,
} from "react";
import { useSelector } from "react-redux";
import { fetchFlightOffers } from "../services/flights/duffelApi";

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

  console.log("FlightsProvider - filters:", filters);

  const [sortingMethod, setSortingMethod] = useState("best");
  const [hasReceivedFirstPage, setHasReceivedFirstPage] = useState(false);
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

  const filterOffers = (offers) => {
    return offers.filter((offer) => {
      // Filtering by stops
      const totalStops = calculateStops(offer);
      if (!filters.stops.includes(totalStops)) return false;

      // Add more filter conditions here...

      return true;
    });
  };

  const updateFilter = (filterName, filterValue) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: filterValue,
    }));
  };

  const getFilteredAndSortedOffers = (offers, filters, sortingMethod) => {
    // Apply filters
    const filteredOffers = offers.filter((offer) => {
      const totalStops = calculateStops(offer); // Rename "stops" to "totalStops"
      return filters.stops.includes(totalStops);
    });

    // Determine the sorting function based on the sortingMethod string
    let sortFunction;
    switch (
      sortingMethod
      // ... cases ...
    ) {
    }

    // Apply sorting
    const sortedOffers = filteredOffers.sort(sortFunction);

    return sortedOffers;
  };

  // Use the getFilteredAndSortedOffers function to get the filtered and sorted offers
  const sortedOffers = useMemo(() => {
    return getFilteredAndSortedOffers(offers, filters, sortingMethod);
  }, [offers, filters, sortingMethod]);

  const fetchFlightOffersPage = async (after) => {
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

      const uniqueNewOffers = newOffers.filter((offer) => {
        return offer.owner.iata_code !== "ZZ";
      });

      const filteredOffers = uniqueNewOffers.filter((offer) => {
        const stops = calculateStops(offer);
        return filters.stops.includes(stops);
      });

      const newOffersSortedByBest = [...filteredOffers].sort(sortByBest);
      const newOffersSortedByPrice = [...filteredOffers].sort(sortByPrice);
      const newOffersSortedByDuration = [...filteredOffers].sort(
        sortByDuration
      );

      setOffersByBest((prevOffers) =>
        mergeSortedArrays(prevOffers, newOffersSortedByBest, sortByBest)
      );
      setOffersByPrice((prevOffers) =>
        mergeSortedArrays(prevOffers, newOffersSortedByPrice, sortByPrice)
      );
      setOffersByDuration((prevOffers) =>
        mergeSortedArrays(prevOffers, newOffersSortedByDuration, sortByDuration)
      );

      setOffers((prevOffers) => [...prevOffers, ...filteredOffers]); // Use filtered offers here
      setAfter(newAfter);

      if (!newAfter && !hasReceivedFirstPage) {
        setHasReceivedFirstPage(true);
        setIsLoading(false);
        console.log("Loading state set to false");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const clearFlightSearchData = () => {
    setAfter(null);
    setIsLoading(true);
    setOffers([]);
    setOffersByBest([]);
    setOffersByPrice([]);
    setOffersByDuration([]);
    setHasReceivedFirstPage(false);
  };

  return (
    <FlightsContext.Provider
      value={{
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
      }}
    >
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
