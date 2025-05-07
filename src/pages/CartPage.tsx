import { Link } from "react-router-dom";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import Button from "../components/ui/CustomButton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCartItems, updateCartItemQuantity } from "@/api/cartService";
import { formatVND } from "@/helpers/formatCurrency";
import { CART_ITEM } from "@/constants/queryKeys";
import { useMemo } from "react";
import toast from "react-hot-toast";

const CartPage = () => {
    const { data: cartItems } = useQuery({
      queryKey: [CART_ITEM],
      queryFn: () => getCartItems(),
    });
  const queryClient = useQueryClient();

  const totalAmount = useMemo(() => {
  return cartItems?.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  ) || 0;
}, [cartItems]);

  const updateQuantity = ( payload : { productId: string, quantity: number }) => {
    updateCartItemQuantity(payload, () => queryClient.invalidateQueries({ queryKey: [CART_ITEM] }), (error) => toast.error(error.message))
  }

  if (!cartItems?.length) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-6">
          <ShoppingBag className="h-8 w-8 text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Your Cart is Empty
        </h2>
        <p className="text-gray-600 mb-6">
          Looks like you haven't added any products to your cart yet.
        </p>
        <Link to="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Remove</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cartItems?.map((item) => (
                    <tr key={item.productId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img
                              src={item.imageUrl}
                              alt={item.productName}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                          <div className="ml-4">
                            <Link
                              to={`/products/${item.productId}`}
                              className="text-gray-900 font-medium hover:text-blue-600"
                            >
                              {item.productName}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">
                          {formatVND(item.price)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            onClick={() =>
                              updateQuantity({productId: item.productId, quantity: item.quantity - 1})
                            }
                            className="px-2 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity({productId: item.productId, quantity: item.quantity + 1})
                            }
                            className="px-2 py-1 text-gray-600 hover:text-gray-800"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900 font-medium">
                          {formatVND(item.price * item.quantity)}
                        </div>
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cart Actions */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <Link to="/products">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">
                  {formatVND(totalAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">Free</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <span className="text-lg font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  {formatVND(totalAmount)}
                </span>
              </div>
            </div>

            <Button fullWidth className="mb-4">
              Proceed to Checkout
            </Button>

            <div className="text-xs text-gray-500 text-center">
              Taxes and shipping calculated at checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
