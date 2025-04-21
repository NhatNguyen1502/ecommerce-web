import { useQuery } from '@tanstack/react-query';
import { Users, ShoppingBag, Tag } from 'lucide-react';
import { getProducts } from '../../api/productService';
import { getCategories } from '../../api/categoryService';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminDashboard = () => {

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const stats = [
    {
      name: 'Total Products',
      value: products?.length || 0,
      icon: <ShoppingBag className="h-6 w-6 text-blue-600" />,
      change: '+12%',
      isPositive: true,
    },
    {
      name: 'Categories',
      value: categories?.length || 0,
      icon: <Tag className="h-6 w-6 text-green-600" />,
      change: '+5%',
      isPositive: true,
    },
    {
      name: 'Customers',
      value: 9,
      icon: <Users className="h-6 w-6 text-purple-600" />,
      change: '+18%',
      isPositive: true,
    },
  ];

  if (productsLoading || categoriesLoading) {
    return (
      <AdminLayout>
        <LoadingSpinner className="py-16" />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm text-gray-500">{stat.name}</p>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;