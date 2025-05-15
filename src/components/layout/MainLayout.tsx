import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { Menu, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-20 transition-opacity bg-gray-600 bg-opacity-75 ${
        sidebarOpen ? 'opacity-100 ease-out duration-300' : 'opacity-0 ease-in duration-200 pointer-events-none'
      }`} onClick={() => setSidebarOpen(false)} />
      
      {/* Sidebar */}
      {/* <div className={`fixed inset-y-0 left-0 z-30 w-48 transition duration-300 transform bg-white lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
      }`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Support Desk</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md lg:hidden hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        <Sidebar />
      </div> */}
      
      {/* Main content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <Header openSidebar={() => setSidebarOpen(true)} />
        
        <main className="relative flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;