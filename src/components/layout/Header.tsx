import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { BarChart2, Bell, Menu, Settings, Ticket, User } from 'lucide-react';
import { RootState } from '../../store';
import NotificationsDropdown from '../notifications/NotificationsDropdown';
import UserDropdown from '../common/UserDropdown';

interface HeaderProps {
  openSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ openSidebar }) => {
  const { unreadCount } = useSelector((state: RootState) => state.notifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-gradient-to-r from-blue-600 to-indigo-500 shadow-lg">
      {showNotifications && (
        <NotificationsDropdown
          onClose={() => setShowNotifications(false)}
        />
      )}
  
      
      <div className="flex-1 flex justify-between px-4">
        <div className="flex flex-1 items-center pl-2 space-x-4">
          <p className="text-xl md:text-3xl font-semibold text-white truncate">Enterprise Ticketing System</p>
          <nav className="hidden lg:flex items-center space-x-2 ml-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-sm font-medium flex items-center transition-all
                  ${isActive 
                    ? 'bg-white/20 text-white ring-2 ring-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'}`
              }
            >
              <BarChart2 className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Dashboard</span>
            </NavLink>
            <NavLink
              to="/tickets"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-sm font-medium flex items-center transition-all
                  ${isActive 
                    ? 'bg-white/20 text-white ring-2 ring-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'}`
              }
            >
              <Ticket className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Tickets</span>
            </NavLink>
          </nav>
        </div>
        
        <div className="ml-4 flex items-center space-x-2 md:space-x-3">
          <div className="relative">
            <button
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white transition-all duration-200"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5 md:h-6 md:w-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-400 text-white text-xs font-bold rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>
          
          <button
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white transition-colors"
          >
            <Settings className="h-5 w-5 md:h-6 md:w-6" />
          </button>
          
          <div className="relative">
            <button
              className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-white/10 backdrop-blur-sm ring-2 ring-white/30 hover:ring-white/50 hover:scale-105 transition-all duration-200"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <User className="h-4 w-4 md:h-5 md:w-5 mx-auto text-white" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;