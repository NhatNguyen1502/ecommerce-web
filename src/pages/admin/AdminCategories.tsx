import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit } from "lucide-react";
import { deleteCategory, getCategories } from "../../api/categoryService";
import AdminLayout from "../../components/admin/AdminLayout";
import Button from "../../components/ui/CustomButton";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import CategoryModal from "../../components/admin/CategoryModal";
import { Category } from "../../types/Category";
import { CATEGORIES } from "../../constants/queryKeys";
import { DeleteButton } from "@/components/admin/DeleteButton";
import toast from "react-hot-toast";
import { formatTimeAgo } from "@/helpers/formatTime";

const AdminCategories = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: [CATEGORIES],
    queryFn: getCategories,
  });

  const handleAddCategory = () => {
    setCurrentCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setCurrentCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    deleteCategory(
      categoryId,
      () => {
        queryClient.invalidateQueries({ queryKey: [CATEGORIES] });
        toast.success("Category deleted successfully");
      },
      () => {
        toast.error("Failed to delete category");
      })
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCategory(null);
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage your product categories</p>
        </div>
        <Button
          onClick={handleAddCategory}
          leftIcon={<Plus className="h-5 w-5" />}
        >
          Add Category
        </Button>
      </div>

      {/* Categories Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Create At
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Update At
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? <LoadingSpinner /> : categories?.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {category.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatTimeAgo(category.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatTimeAgo(category.updatedAt)}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <DeleteButton
                    itemName={category.name}
                    onConfirm={() => handleDeleteCategory(category.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <CategoryModal category={currentCategory} onClose={handleCloseModal} />
      )}
    </AdminLayout>
  );
};

export default AdminCategories;