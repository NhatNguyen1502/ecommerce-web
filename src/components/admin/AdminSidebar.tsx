import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Smartphone, Layers, Users, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: <Smartphone className="h-5 w-5" />,
    },
    {
      name: 'Categories',
      path: '/admin/categories',
      icon: <Layers className="h-5 w-5" />,
    },
    {
      name: 'Customers',
      path: '/admin/customers',
      icon: <Users className="h-5 w-5" />,
    },
  ];

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen flex-shrink-0">
      <div className="p-4 h-16 flex items-center border-b border-gray-700">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
      </div>
      <nav className="mt-4">
        <ul className="space-y-1 px-2">
          {menuItems.map(item => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="px-2 mt-8">
          <Link
            to="/"
            className="flex items-center px-4 py-3 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <Smartphone className="h-5 w-5" />
            <span className="ml-3">View Store</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-3 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;