import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { RootState } from '../../store';
import { 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  clearAllNotifications 
} from '../../store/slices/notificationsSlice';
import { format, formatDistanceToNow } from 'date-fns';

interface NotificationsDropdownProps {
  onClose: () => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications } = useSelector((state: RootState) => state.notifications);
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

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const handleClearAll = () => {
    dispatch(clearAllNotifications());
  };

  const handleNotificationClick = (notification: any) => {
    dispatch(markNotificationAsRead(notification.id));
    
    if (notification.ticketId) {
      navigate(`/tickets/${notification.ticketId}`);
      onClose();
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
    >
      <div className="py-2 px-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleMarkAllAsRead}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Mark all as read
          </button>
          <button
            onClick={handleClearAll}
            className="text-xs text-red-600 hover:text-red-800"
          >
            Clear all
          </button>
        </div>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-8 text-center">
            <Bell className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No notifications</p>
          </div>
        ) : (
          <div className="py-1">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                className={`w-full block px-4 py-3 text-left hover:bg-gray-50 ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className={`text-sm ${!notification.read ? 'font-semibold' : 'text-gray-600'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(notification.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="ml-2 flex-shrink-0 flex">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-600"></div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="py-2 px-4 border-t border-gray-100 text-center">
        <button
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationsDropdown;