import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Bell, Clock, Key, Mail, Moon, Shield, User } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      <p className="mt-2 text-sm text-gray-700">
        Manage your account settings and preferences.
      </p>

      <div className="mt-6 space-y-8">
        {/* Profile Settings */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <User className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  defaultValue={user?.name}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  defaultValue={user?.email}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <Bell className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Notification Preferences</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="email-notifications"
                    name="email-notifications"
                    type="checkbox"
                    defaultChecked
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="email-notifications" className="font-medium text-gray-700">
                    Email notifications
                  </label>
                  <p className="text-gray-500">Get notified when new tickets are assigned to you or when a customer replies.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="status-changes"
                    name="status-changes"
                    type="checkbox"
                    defaultChecked
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="status-changes" className="font-medium text-gray-700">
                    Status changes
                  </label>
                  <p className="text-gray-500">Get notified when a ticket's status changes.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="browser-notifications"
                    name="browser-notifications"
                    type="checkbox"
                    defaultChecked
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="browser-notifications" className="font-medium text-gray-700">
                    Browser notifications
                  </label>
                  <p className="text-gray-500">Show desktop notifications when you receive new messages or updates.</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save preferences
              </button>
            </div>
          </div>
        </div>

        {/* Only show security settings for ADMIN users */}
        {user?.role === 'ADMIN' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex items-center">
              <Shield className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg leading-6 font-medium text-gray-900">Security Settings</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Two-factor authentication</h4>
                  <p className="mt-1 text-sm text-gray-500">Add additional security to your account using two-factor authentication.</p>
                  <div className="mt-2">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Key className="mr-2 h-4 w-4 text-gray-500" />
                      Setup 2FA
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900">Session management</h4>
                  <p className="mt-1 text-sm text-gray-500">Manage your active sessions and sign out from other devices.</p>
                  <div className="mt-2">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Clock className="mr-2 h-4 w-4 text-gray-500" />
                      Manage sessions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* App Appearance */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <Moon className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Appearance</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="space-y-4">
              <fieldset>
                <legend className="text-sm font-medium text-gray-900">Theme</legend>
                <div className="mt-2 space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                  <div className="flex items-center">
                    <input
                      id="light"
                      name="theme"
                      type="radio"
                      defaultChecked
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label htmlFor="light" className="ml-3 block text-sm font-medium text-gray-700">
                      Light
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="dark"
                      name="theme"
                      type="radio"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label htmlFor="dark" className="ml-3 block text-sm font-medium text-gray-700">
                      Dark
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="system"
                      name="theme"
                      type="radio"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label htmlFor="system" className="ml-3 block text-sm font-medium text-gray-700">
                      System
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save appearance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;