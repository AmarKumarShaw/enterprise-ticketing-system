import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import MainLayout from './components/layout/MainLayout';
import TicketList from './components/tickets/TicketList';
import TicketDetail from './components/tickets/TicketDetail';
import Dashboard from './components/dashboard/Dashboard';
import Settings from './components/settings/Settings';
import { initializeWebSocket } from './services/websocketService';

function App() {
  // Initialize WebSocket connection when app starts
  useEffect(() => {
    initializeWebSocket();
    return () => {
      // Clean up WebSocket connection when app unmounts
      // disconnectWebSocket();
    };
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="tickets" element={<TicketList />} />
            <Route path="tickets/:id" element={<TicketDetail />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;