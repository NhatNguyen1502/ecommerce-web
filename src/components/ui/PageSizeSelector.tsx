interface PageSizeSelectorProps {
  pageSize: number;
  handlePageSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function PageSizeSelector({
  pageSize,
  handlePageSizeChange,
}: PageSizeSelectorProps) {
  return (
    <div className="mb-4 flex justify-end">
      <div className="flex items-center">
        <label htmlFor="pageSize" className="mr-2 text-sm text-gray-600">
          Items per page:
        </label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={handlePageSizeChange}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  );
}
