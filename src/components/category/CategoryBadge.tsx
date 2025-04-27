import { Link } from "react-router-dom";
import type { Category } from "../../types/Category";

interface CategoryBadgeProps {
  category: Category;
}

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  // Get color scheme based on category name
  const getColorScheme = (name: string) => {
    const colorSchemes = {
      default: "from-rose-500 to-orange-500",
      electronics: "from-purple-600 to-blue-500",
      clothing: "from-emerald-500 to-teal-400",
      books: "from-amber-500 to-yellow-400",
      furniture: "from-rose-500 to-pink-500",
      food: "from-green-500 to-lime-400",
      toys: "from-cyan-500 to-blue-400",
      sports: "from-orange-500 to-amber-400",
      beauty: "from-pink-500 to-rose-400",
      health: "from-teal-500 to-emerald-400",
    };

    // Convert category name to lowercase and remove spaces
    const key = name
      .toLowerCase()
      .replace(/\s+/g, "") as keyof typeof colorSchemes;
    return colorSchemes[key] || colorSchemes.default;
  };

  const bgGradient = getColorScheme(category.name);

  return (
    <Link to={`/products/category/${category.id}`} className="inline-block">
      <div
        className={`px-4 py-2 rounded-full bg-gradient-to-br ${bgGradient} text-white font-medium 
                   hover:shadow-md transition-all duration-300 relative overflow-hidden group`}
      >
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2)_0,_rgba(255,255,255,0.2)_1px,_transparent_1px)] bg-[length:12px_12px]"></div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

        {/* Category name */}
        <span className="relative z-10">{category.name}</span>
      </div>
    </Link>
  );
};

export default CategoryBadge;
