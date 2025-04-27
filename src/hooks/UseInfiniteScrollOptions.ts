import { useEffect, useRef } from "react";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";

interface UseInfiniteScrollOptions {
  /**
   * Whether there are more items to load
   */
  hasNextPage: boolean | undefined;
  /**
   * Whether the next page is currently being fetched
   */
  isFetchingNextPage: boolean;
  /**
   * Function to fetch the next page
   */
  fetchNextPage: () => Promise<any>;
  /**
   * Threshold for when to trigger the next page fetch (0-1)
   * @default 0.1
   */
  threshold?: number;
  /**
   * Whether to enable the infinite scroll
   * @default true
   */
  enabled?: boolean;
}

/**
 * Hook to handle infinite scrolling using Intersection Observer
 */
export function useInfiniteScroll({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 0.1,
  enabled = true,
}: UseInfiniteScrollOptions) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If disabled, don't set up the observer
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // If the target is intersecting and we have more pages to load and we're not already loading
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold }
    );

    // Start observing the target element
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    // Cleanup function to unobserve when component unmounts
    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, threshold, enabled]);

  return {
    observerTarget,
  };
}

/**
 * Helper type to extract the data from an infinite query result
 */
export type InfiniteData<T> = NonNullable<
  UseInfiniteQueryResult<T, unknown>["data"]
>;
