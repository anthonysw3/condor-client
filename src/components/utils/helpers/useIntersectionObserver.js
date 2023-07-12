import { useEffect, useRef } from "react";

function useIntersectionObserver(isVisibleCallback) {
  const lastItemRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisibleCallback();
        }
      },
      { threshold: 1.0 }
    );

    if (lastItemRef.current) {
      observer.observe(lastItemRef.current);
    }

    const currentRef = lastItemRef.current;
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isVisibleCallback]);

  return lastItemRef;
}

export default useIntersectionObserver;
