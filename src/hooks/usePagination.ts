import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

interface PaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  defaultPage?: number;
  defaultPageSize?: number;
}

export function usePagination({
  initialPage,
  initialPageSize,
  defaultPage = 0,
  defaultPageSize = 10,
}: PaginationOptions = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get values from URL or use provided defaults
  const pageFromUrl = searchParams.get("page");
  const sizeFromUrl = searchParams.get("size");

  const [page, setPage] = useState(
    initialPage !== undefined
      ? initialPage
      : pageFromUrl !== null
      ? Number(pageFromUrl)
      : defaultPage
  );

  const [pageSize, setPageSize] = useState(
    initialPageSize !== undefined
      ? initialPageSize
      : sizeFromUrl !== null
      ? Number(sizeFromUrl)
      : defaultPageSize
  );

  // Update URL when pagination changes
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    newParams.set("size", pageSize.toString());
    setSearchParams(newParams);
  }, [page, pageSize, setSearchParams, searchParams]);

  // Handler for page changes
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Handler for page size changes
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number.parseInt(e.target.value);
    setPageSize(newSize);
    setPage(0); // Reset to first page when changing page size
  };

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    handlePageChange,
    handlePageSizeChange,
    paginationParams: { page, size: pageSize },
  };
}
