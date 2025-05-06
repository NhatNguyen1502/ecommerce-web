import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Smartphone, ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import CategoryMenu from "../category/CategoryMenu";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCartItemCount } from "@/api/cartService";
import { CART_ITEM_COUNT } from "@/constants/queryKeys";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const { data: totalItems } = useQuery({
    queryKey: [CART_ITEM_COUNT],
    queryFn: () => getCartItemCount(),
  });

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    setIsProfileOpen(false);
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Smartphone className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold">MobileShop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <CategoryMenu />
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-600 ${
                  isActive ? "font-medium text-blue-600" : ""
                }`
              }
            >
              All Products
            </NavLink>
          </nav>

          {/* Desktop Right-side actions */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <div className="relative">
                <button
                  className="flex items-center text-gray-700 hover:text-blue-600"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <User className="h-5 w-5 mr-1" />
                  <span>{user.email}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 inline mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-blue-600">
                Login
              </Link>
            )}

            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-blue-600" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md ${
                  isActive ? "bg-blue-50 text-blue-600" : "text-gray-700"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md ${
                  isActive ? "bg-blue-50 text-blue-600" : "text-gray-700"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              All Products
            </NavLink>
            <div className="px-3 py-2">
              <CategoryMenu isMobile setIsMobileMenuOpen={setIsOpen} />
            </div>
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md text-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  to="/cart"
                  className="block px-3 py-2 rounded-md text-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  Cart ({totalItems})
                </Link>
                <button
                  className="block w-full text-left px-3 py-2 rounded-md text-gray-700"
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;


