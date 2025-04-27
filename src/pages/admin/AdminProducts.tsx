import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Star } from "lucide-react";
import { deleteProduct, getProducts } from "../../api/productService";
import AdminLayout from "../../components/admin/AdminLayout";
import Button from "../../components/ui/CustomButton";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ProductModal from "../../components/admin/ProductModal";
import Pagination from "../../components/ui/Pagination";
import { usePagination } from "../../hooks/usePagination";
import type { Product } from "../../types/Product";
import { PRODUCTS } from "@/constants/queryKeys";
import { DeleteButton } from "@/components/admin/DeleteButton";
import toast from "react-hot-toast";
import Tooltip from "@/components/ui/Tooltip";
import { formatTimeAgo } from "@/helpers/formatTime";
import PageSizeSelector from "@/components/ui/PageSizeSelector";
import { formatVND } from "@/helpers/formatCurrency";

const AdminProducts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();

  // Use the custom pagination hook
  const { page, pageSize, handlePageChange, handlePageSizeChange } =
    usePagination();

  const { data: productsData, isLoading } = useQuery({
    queryKey: [PRODUCTS, page, pageSize],
    queryFn: () => getProducts(page, pageSize),
  });

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    deleteProduct(
      productId,
      () => {
        queryClient.invalidateQueries({ queryKey: [PRODUCTS] });
        toast.success("Product deleted successfully");
      },
      () => {
        toast.error("Failed to delete product");
      }
    );
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  const products = productsData?.content || [];
  const totalPages = productsData?.totalPages || 1;
  const totalElements = productsData?.totalElements || 0;

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Button
          onClick={handleAddProduct}
          leftIcon={<Plus className="h-5 w-5" />}
        >
          Add Product
        </Button>
      </div>

      {/* Page size selector */}
      <PageSizeSelector
        pageSize={pageSize}
        handlePageSizeChange={handlePageSizeChange}
      />

      {/* Products Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="relative">
          {/* Table with fixed header */}
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[30%]"
                >
                  Product
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]"
                >
                  Quantity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]"
                >
                  Featured
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]"
                >
                  Update at
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
                  products.map((product) => {
                    return (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap w-[30%]">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden">
                              <img
                                src={product.imageUrl || "/placeholder.svg"}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                                <span className="text-gray-400 inline-flex items-center gap-0">
                                  {product.averageRating?.toFixed(1)}{" "}
                                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />{" "}
                                  ({product?.ratingCount})
                                </span>
                              </div>
                              <Tooltip content={product.description}>
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {product.description.substring(0, 30)}{" "}
                                  {product.description.length > 30 && "..."}
                                </div>
                              </Tooltip>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap w-[15%]">
                          <div className="text-sm text-gray-900">
                            {product.category.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap w-[10%]">
                          <div className="text-sm text-gray-900">
                            {formatVND(product.price)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap w-[10%]">
                          <div className="text-sm text-gray-900">
                            {product.quantity}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap w-[10%]">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.isFeatured
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {product.isFeatured ? "True" : "False"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-[15%]">
                          {formatTimeAgo(product.updatedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium w-[10%]">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <DeleteButton
                            itemName={product.name}
                            onConfirm={() => handleDeleteProduct(product.id)}
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

      {/* Product Modal */}
      {isModalOpen && (
        <ProductModal product={currentProduct} onClose={handleCloseModal} />
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
