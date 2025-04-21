import { createContext, ReactNode, useEffect, useState } from 'react';
import { Cart, CartItem } from '../types/Cart';
import { Product } from '../types/Product';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
}

export const CartContext = createContext<CartContextType>({
  cart: { items: [], totalAmount: 0 },
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart>({ items: [], totalAmount: 0 });
  const [totalItems, setTotalItems] = useState(0);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart: Cart = JSON.parse(savedCart);
      setCart(parsedCart);
      setTotalItems(
        parsedCart.items.reduce((total, item) => total + item.quantity, 0)
      );
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    setTotalItems(cart.items.reduce((total, item) => total + item.quantity, 0));
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prevCart => {
      // Check if product already exists in cart
      const existingItemIndex = prevCart.items.findIndex(
        item => item.productId === product.id
      );

      let updatedItems: CartItem[];

      if (existingItemIndex !== -1) {
        // Update existing item quantity
        updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
      } else {
        // Add new item to cart
        const newItem: CartItem = {
          id: Date.now().toString(), // Generate a unique ID
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          image: product.images[0],
        };
        updatedItems = [...prevCart.items, newItem];
      }

      // Calculate new total amount
      const totalAmount = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return {
        items: updatedItems,
        totalAmount,
      };
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(
        item => item.productId !== productId
      );
      
      // Calculate new total amount
      const totalAmount = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return {
        items: updatedItems,
        totalAmount,
      };
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;

    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      );
      
      // Calculate new total amount
      const totalAmount = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return {
        items: updatedItems,
        totalAmount,
      };
    });
  };

  const clearCart = () => {
    setCart({ items: [], totalAmount: 0 });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};