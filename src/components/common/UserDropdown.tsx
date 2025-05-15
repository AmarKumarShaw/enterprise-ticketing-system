import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut, User, Settings } from 'lucide-react';
import { logout, setRole } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import { UserRole } from '../../types';

interface UserDropdownProps {
  onClose: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleLogout = () => {
    dispatch(logout());
    onClose();
  };

  const handleRoleChange = (role: UserRole) => {
    dispatch(setRole(role));
    onClose();
  };

  if (!user) return null;

  return (
    <div
      ref={dropdownRef}
      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
    >
      <div className="py-1 border-b border-gray-100">
        <div className="block px-4 py-2 text-sm text-gray-700">
          <p className="font-medium">{user.name}</p>
          <p className="text-gray-500 text-xs mt-0.5">{user.email}</p>
        </div>
      </div>
      
      <div className="py-1">
        <button
          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <User className="mr-3 h-4 w-4 text-gray-500" />
          Profile
        </button>
        <button
          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <Settings className="mr-3 h-4 w-4 text-gray-500" />
          Settings
        </button>
      </div>
      
      {/* For demo purposes: switch between roles */}
      <div className="py-1 border-t border-gray-100">
        <div className="px-4 py-2 text-xs text-gray-500">
          Demo: Switch Role
        </div>
        <button
          onClick={() => handleRoleChange('AGENT')}
          className={`block w-full text-left px-4 py-2 text-sm ${user.role === 'AGENT' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Support Agent
        </button>
        <button
          onClick={() => handleRoleChange('ADMIN')}
          className={`block w-full text-left px-4 py-2 text-sm ${user.role === 'ADMIN' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Administrator
        </button>
        <button
          onClick={() => handleRoleChange('CUSTOMER')}
          className={`block w-full text-left px-4 py-2 text-sm ${user.role === 'CUSTOMER' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Customer
        </button>
      </div>
      
      <div className="py-1 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50"
        >
          <LogOut className="mr-3 h-4 w-4 text-red-500" />
          Sign out
        </button>
      </div>
    </div>
  );
};

export default UserDropdown;