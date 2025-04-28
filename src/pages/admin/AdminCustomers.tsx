import { useState } from "react";
import { MutationFunction, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { CUSTOMERS } from "@/constants/queryKeys";
import { deleteCustomer, getCustomers, updateCustomerStatus } from "@/api/customerService";
import Tooltip from "@/components/ui/Tooltip";
import { formatTimeAgo } from "@/helpers/formatTime";
import Pagination from "@/components/ui/Pagination";
import { usePagination } from "@/hooks/usePagination";
import { DeleteButton } from "@/components/admin/DeleteButton";
import toast from "react-hot-toast";
import PageSizeSelector from "@/components/ui/PageSizeSelector";
import StatusToggle from "@/components/admin/StatusToggle";
import { useNavigate } from "react-router-dom";

const AdminCustomers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  let navigate = useNavigate();

  const queryClient = useQueryClient();

  const { page, pageSize, handlePageChange, handlePageSizeChange } =
    usePagination();

  const { data: customersData, isLoading } = useQuery({
    queryKey: [CUSTOMERS, page, pageSize],
    queryFn: () => getCustomers(page, pageSize, (error) => { 
      toast.error(error.message);
      navigate("/login");
    }),
  });

  const customers = customersData?.content || [];
  const totalPages = customersData?.totalPages || 1;
  const totalElements = customersData?.totalElements || 0;

  const handleDeleteCustomer = (id: string) => {
    deleteCustomer(
      id,
      () => {
        queryClient.invalidateQueries({ queryKey: [CUSTOMERS] });
        toast.success("Customer deleted successfully");
      },
      () => {
        toast.error("Failed to delete customer");
      }
    );
  };

const handleUpdateCustomerStatus: MutationFunction<
  void,
  { id: string; isActive: boolean }
> = async ({ id, isActive }) => {
  await updateCustomerStatus(
    id,
    { isActive: !isActive },
    () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS] });
      toast.success("Customer status updated successfully");
    },
    (error) => {
      toast.error(error.message);
    }
  );
};

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600">Manage your customer accounts</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchTerm && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Page size selector */}
      <PageSizeSelector
        pageSize={pageSize}
        handlePageSizeChange={handlePageSizeChange}
      />

      {/* Customers Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="relative">
          {/* Table with fixed header */}
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]"
                >
                  Address
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]"
                >
                  Phone Number
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]"
                >
                  Active
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]"
                >
                  Created At
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]"
                >
                  Update At
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]"
                >
                  Actions
                </th>
              </tr>
            </thead>
          </table>

          {/* Scrollable table body */}
          <div className="overflow-y-auto max-h-[550px]">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  customers.map((customer) => {
                    return (
                      <tr key={customer.id}>
                        <td className="px-6 py-4 whitespace-nowrap w-[15%]">
                          <Tooltip
                            content={
                              customer.firstName + " " + customer.lastName
                            }
                          >
                            <span className="text-sm truncate max-w-xs">
                              {customer.firstName +
                                " " +
                                customer.lastName.substring(0, 30)}
                            </span>
                          </Tooltip>
                          <Tooltip content={customer.email}>
                            <div className="text-sm truncate max-w-xs">
                              {customer.email.substring(0, 30)}
                            </div>
                          </Tooltip>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap w-[20%]">
                          <Tooltip content={customer.address}>
                            <div className="text-sm truncate max-w-xs">
                              {customer.address.substring(0, 30)}
                            </div>
                          </Tooltip>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap w-[15%]">
                          <div className="text-sm text-gray-900">
                            {customer.phoneNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap w-[10%]">
                          <StatusToggle
                            id={customer.id}
                            isActive={customer.active}
                            entityName="Customer"
                            updateFunction={handleUpdateCustomerStatus}
                            size="sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-[15%]">
                          {formatTimeAgo(customer.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-[15%]">
                          {formatTimeAgo(customer.updatedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium w-[10%]">
                          <DeleteButton
                            itemName={
                              customer.firstName + " " + customer.lastName
                            }
                            onConfirm={() => handleDeleteCustomer(customer.id)}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination component */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={handlePageChange}
          isZeroIndexed={true}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;



