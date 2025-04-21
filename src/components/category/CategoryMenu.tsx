import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../../api/categoryService';

interface CategoryMenuProps {
  isMobile?: boolean;
  setIsMobileMenuOpen?: (isOpen: boolean) => void;
}

const CategoryMenu = ({ isMobile = false, setIsMobileMenuOpen }: CategoryMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  const handleCategoryClick = () => {
    if (isMobile && setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <div className="space-y-2">
        <div className="font-medium text-gray-700">Categories</div>
        <div className="ml-4 space-y-1">
          {categories?.map(category => (
            <Link
              key={category.id}
              to={`/products/category/${category.id}`}
              className="block text-gray-600 hover:text-blue-600"
              onClick={handleCategoryClick}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        className="flex items-center text-gray-700 hover:text-blue-600"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        Categories
        <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          {categories?.map(category => (
            <Link
              key={category.id}
              to={`/products/category/${category.id}`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={handleCategoryClick}
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryMenu;