import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchTickets } from '../../store/slices/ticketsSlice';
import { RootState } from '../../store';
import { AlertTriangle, Clock, CheckCircle, BarChart2, Users, Ticket, ArrowRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tickets, loading } = useSelector((state: RootState) => state.tickets);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchTickets({
      page: 1,
      limit: 100, // Get all tickets for stats calculation
    }) as any);
  }, [dispatch]);

  // Calculate ticket statistics
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'OPEN').length,
    inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    resolved: tickets.filter(t => t.status === 'RESOLVED').length,
    closed: tickets.filter(t => t.status === 'CLOSED').length,
    critical: tickets.filter(t => t.priority === 'CRITICAL').length,
    high: tickets.filter(t => t.priority === 'HIGH').length,
  };

  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  if (loading && tickets.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'IN_PROGRESS':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'RESOLVED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'CLOSED':
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-sm text-gray-700">
        Welcome back, {user?.name}! Here's an overview of the support system.
      </p>

      {/* Stats cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Ticket className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Tickets</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.total}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <button 
                className="font-medium text-blue-600 hover:text-blue-500 flex items-center"
                onClick={() => navigate('/tickets')}
              >
                View all tickets
                <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Open Tickets</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.open}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <button
                className="font-medium text-blue-600 hover:text-blue-500 flex items-center"
                onClick={() => navigate('/tickets', { state: { filters: { status: 'OPEN' } } })}
              >
                View open tickets
                <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Resolved Tickets</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.resolved}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <button
                className="font-medium text-blue-600 hover:text-blue-500 flex items-center"
                onClick={() => navigate('/tickets', { state: { filters: { status: 'RESOLVED' } } })}
              >
                View resolved tickets
                <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Critical Tickets</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.critical}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <button
                className="font-medium text-blue-600 hover:text-blue-500 flex items-center"
                onClick={() => navigate('/tickets', { state: { filters: { priority: 'CRITICAL' } } })}
              >
                View critical tickets
                <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent tickets */}
      <div className="mt-6">
        <h2 className="text-lg font-medium text-gray-900">Recent Tickets</h2>
        <div className="mt-3 bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {recentTickets.map((ticket) => (
              <li key={ticket.id}>
                <button
                  className="block hover:bg-gray-50 w-full text-left"
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="truncate">
                        <div className="flex">
                          {getStatusIcon(ticket.status)}
                          <p className="ml-2 text-sm font-medium text-blue-600 truncate">
                            {ticket.title}
                          </p>
                        </div>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <p>
                            {ticket.createdBy.name} • {ticket.priority} priority •{' '}
                            {ticket.messages.length} messages
                          </p>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${ticket.status === 'OPEN' ? 'bg-blue-100 text-blue-800' : 
                            ticket.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                            ticket.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'}`
                        }>
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Additional dashboard components would go here */}
    </div>
  );
};

export default Dashboard;