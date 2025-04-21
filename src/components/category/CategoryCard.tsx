import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Category } from '../../types/Category';

interface CategoryCardProps {
  category: Category;
}

const getCategoryImage = (categoryName: string) => {
  const images: Record<string, string> = {
    Smartphones:
      "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    Tablets:
      "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    Accessories:
      "https://bizweb.dktcdn.net/thumb/1024x1024/100/356/047/products/airpods-pro-2-jpeg.jpg?v=1685453688050",
    Wearables:
      "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  };

  return images[categoryName] || 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
};

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link 
      to={`/products/category/${category.id}`}
      className="group relative overflow-hidden rounded-lg shadow hover:shadow-md transition-all duration-300"
    >
      <div className="aspect-square">
        <img 
          src={getCategoryImage(category.name)}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      </div>
      <div className="absolute bottom-0 left-0 w-full p-4 text-white">
        <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
        <div className="flex items-center text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Shop now</span>
          <ArrowRight className="ml-1 h-4 w-4" />
        </div>
      </div>
    </Link>
  );
};


export default CategoryCard;