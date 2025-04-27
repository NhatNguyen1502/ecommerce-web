import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Product, ProductPayload } from "../../types/Product";
import type { Category } from "../../types/Category";
import Button from "../ui/CustomButton";
import { createProduct, updateProduct } from "@/api/productService";
import { CATEGORIES, PRODUCTS } from "@/constants/queryKeys";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import LoadingSpinner from "../ui/LoadingSpinner";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

const ProductModal = ({ product, onClose }: ProductModalProps) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, watch } = useForm<ProductPayload>({
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          categoryId: product.category.id,
          isFeatured: product.isFeatured,
        }
      : undefined,
  });

  const categories =
    (queryClient.getQueryState([CATEGORIES])?.data as Category[]) || [];


  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.imageUrl || null
  );
  const [hasChanges, setHasChanges] = useState(false);

  // Watch all form fields for changes
  const watchedFields = watch();

  // Check if form values have changed from original product
  useEffect(() => {
    if (!product) {
      // For new products, always enable the button
      setHasChanges(true);
      return;
    }

    // Check if any form field has changed
    const formChanged = Boolean(
      watchedFields.name !== product.name ||
        watchedFields.description !== product.description ||
        Number(watchedFields.price) !== product.price ||
        Number(watchedFields.quantity) !== product.quantity ||
        watchedFields.categoryId !== product.category.id ||
        watchedFields.isFeatured !== product.isFeatured
    );

    // Check if image has changed
    const imageChanged = Boolean(
      imageFile !== null || (product.imageUrl && imagePreview === null)
    );

    setHasChanges(formChanged || imageChanged);
  }, [watchedFields, product, imageFile, imagePreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const mutation = useMutation({
    mutationFn: product
      ? (formData: FormData) =>
          updateProduct(
            product.id,
            formData,
            () => {
              queryClient.invalidateQueries({ queryKey: [PRODUCTS] });
              onClose();
              toast.success("Product updated successfully");
            },
            (error) => {
              toast.error(error.message);
            }
          )
      : (formData: FormData) =>
          createProduct(
            formData,
            () => {
              queryClient.invalidateQueries({ queryKey: [PRODUCTS] });
              onClose();
              toast.success("Product added successfully");
            },
            (error) => {
              toast.error(error.message);
            }
          ),
  });

  const onSubmit = (data: ProductPayload) => {
    // Create a FormData object for multipart/form-data
    const formData = new FormData();

    // Add the product data as JSON in a part named "product"
    const productData = {
      name: data.name,
      description: data.description,
      price: data.price,
      quantity: data.quantity,
      categoryId: data.categoryId,
      isFeatured: data.isFeatured,
    };

    // Add the JSON data as a Blob with the correct content type
    const productBlob = new Blob([JSON.stringify(productData)], {
      type: "application/json",
    });

    // Add the product JSON part
    formData.append("product", productBlob);

    // Add the image file if it exists
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Send the FormData to the server
    mutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {product ? "Edit Product" : "Add New Product"}
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
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    {...register("name", { required: true, maxLength: 200 })}
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="categoryId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="categoryId"
                    required
                    {...register("categoryId", { required: true })}
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a category</option>
                    {categories?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    min="0"
                    step="0.01"
                    required
                    {...register("price", { required: true, min: 0 })}
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    min="0"
                    step="1"
                    required
                    {...register("quantity", { required: true, min: 0 })}
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <div className="flex items-center h-5">
                    <input
                      id="isFeatured"
                      type="checkbox"
                      {...register("isFeatured")}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="isFeatured"
                      className="font-medium text-gray-700"
                    >
                      Featured Product
                    </label>
                    <p className="text-gray-500">
                      Featured products appear on the homepage
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={4}
                required
                {...register("description", { required: true })}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Images */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Product Image{" "}
                  {!product && <span className="text-red-500">*</span>}
                </label>
              </div>

              <div className="space-y-3">
                {imagePreview ? (
                  <div className="relative border rounded-lg p-2 w-full">
                    <div className="flex items-start">
                      <div className="relative h-40 w-40 rounded-md overflow-hidden">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="ml-2 p-1 bg-red-100 rounded-full text-red-500 hover:bg-red-200"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                    <div className="mb-2">
                      <Plus className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      Drag and drop an image, or click to select
                    </p>
                    <input
                      type="file"
                      id="image"
                      required
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-medium
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending || Boolean(product && !hasChanges)}
            >
              {mutation.isPending ? (
                <LoadingSpinner
                  className="w-auto"
                  loadingClassName="text-white"
                />
              ) : product ? (
                "Update Product"
              ) : (
                "Create Product"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;


