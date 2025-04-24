import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  isZeroIndexed?: boolean;
}

const Pagination = ({
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
  isZeroIndexed = true,
}: PaginationProps) => {
  // For display purposes, we show page numbers starting from 1
  const displayPage = isZeroIndexed ? currentPage + 1 : currentPage;

  // Calculate which page numbers to show
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    if (totalPages <= 5) return i;

    if (displayPage <= 3) return i;
    if (displayPage >= totalPages - 2) return totalPages - 5 + i;

    return displayPage - 3 + i;
  });

  // Jump to first page
  const handleFirstPage = () => {
    onPageChange(0);
  };

  // Jump to last page
  const handleLastPage = () => {
    onPageChange(totalPages - 1);
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() =>
            onPageChange(Math.min(totalPages - 1, currentPage + 1))
          }
          disabled={currentPage === totalPages - 1}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing page <span className="font-medium">{displayPage}</span> of{" "}
            <span className="font-medium">{totalPages}</span> pages (total{" "}
            {totalElements} elements)
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            {/* First Page Button */}
            <button
              onClick={handleFirstPage}
              disabled={currentPage === 0}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">First Page</span>
              <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Previous Button */}
            <button
              onClick={() => onPageChange(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Page Numbers */}
            {pages.map((pageIndex) => {
              const pageNumber = isZeroIndexed ? pageIndex : pageIndex + 1;
              const displayNumber = isZeroIndexed ? pageNumber + 1 : pageNumber;

              return (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  aria-current={currentPage === pageNumber ? "page" : undefined}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    currentPage === pageNumber
                      ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  }`}
                >
                  {displayNumber}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              onClick={() =>
                onPageChange(Math.min(totalPages - 1, currentPage + 1))
              }
              disabled={currentPage === totalPages - 1}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Last Page Button */}
            <button
              onClick={handleLastPage}
              disabled={currentPage === totalPages - 1}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Last Page</span>
              <ChevronsRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
