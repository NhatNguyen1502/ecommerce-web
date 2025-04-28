import { X } from "lucide-react";
import {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "../../types/Category";
import Button from "../ui/CustomButton";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory, updateCategory } from "../../api/categoryService";
import toast from "react-hot-toast";
import { CATEGORIES } from "../../constants/queryKeys";
import LoadingSpinner from "../ui/LoadingSpinner";

interface CategoryModalProps {
  category: Category | null;
  onClose: () => void;
}

const CategoryModal = ({ category, onClose }: CategoryModalProps) => {
  const { register, handleSubmit } = useForm<CreateCategoryPayload>();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: category
      ? (data: UpdateCategoryPayload) =>
          updateCategory(
            category.id,
            data,
            () => {
              queryClient.invalidateQueries({ queryKey: [CATEGORIES] });
              onClose();
              toast.success("Category updated successfully");
            },
            (error) => {
              toast.error(error.message);
            }
          )
      : (data: CreateCategoryPayload) =>
          createCategory(
            data,
            () => {
              queryClient.invalidateQueries({ queryKey: [CATEGORIES] });
              onClose();
              toast.success("Category added successfully");
            },
            (error) => {
              toast.error(error.message);
            }
          ),
  });

  const onSubmit: SubmitHandler<CreateCategoryPayload> = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {category ? "Edit Category" : "Add New Category"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                defaultValue={category?.name}
                required
                {...register("name", { maxLength: 25 })}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {mutation.isPending ? (
              <LoadingSpinner className="w-auto" />
            ) : (
              <Button type="submit">
                {category ? "Update Category" : "Create Category"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
