import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart2, Settings, Ticket, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const Sidebar: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const navigation = [
    { name: 'Dashboard', icon: BarChart2, href: '/' },
    { name: 'Tickets', icon: Ticket, href: '/tickets' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  // Add admin-only navigation items
  if (user?.role === 'ADMIN') {
    navigation.push({ name: 'Users', icon: Users, href: '/users' });
  }

  return (
    <div className="h-0 flex-1 flex flex-col overflow-y-auto">
      <nav className="px-2 py-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all ${
                isActive
                  ? 'bg-blue-600 text-white ring-2 ring-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User info at bottom of sidebar */}
      <div className="border-t border-gray-200 p-4 mt-auto">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {user?.avatarUrl ? (
              <img
                className="h-10 w-10 rounded-full"
                src={user.avatarUrl}
                alt={user.name}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 font-medium">
                  {user?.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;