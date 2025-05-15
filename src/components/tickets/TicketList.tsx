import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { ClockIcon, AlertTriangle, CheckCircle, Clock, Plus } from 'lucide-react';
import { fetchTickets } from '../../store/slices/ticketsSlice';
import { RootState } from '../../store';
import { TicketStatus, TicketPriority } from '../../types';
import { format } from 'date-fns';
import CreateTicketModal from './CreateTicketModal';

const TicketList: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { tickets, loading, totalTickets, currentPage, totalPages } = useSelector(
    (state: RootState) => state.tickets
  );
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '' as TicketStatus | '',
    priority: '' as TicketPriority | '',
    assignedTo: '',
    tags: '',
    search: '',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc',
  });

  useEffect(() => {
    if (location.state?.filters) {
      setFilters(prev => ({
        ...prev,
        ...location.state.filters
      }));
    }
  }, [location.state]);

  useEffect(() => {
    dispatch(fetchTickets(filters) as any);
  }, [dispatch, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
      page: 1, // Reset to first page when filters change
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters({
        ...filters,
        page: newPage,
      });
    }
  };

  const getPriorityBadge = (priority: TicketPriority) => {
    const classes = {
      LOW: 'bg-gray-100 text-gray-800',
      MEDIUM: 'bg-blue-100 text-blue-800',
      HIGH: 'bg-orange-100 text-orange-800',
      CRITICAL: 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes[priority]}`}>
        {priority === 'CRITICAL' && <AlertTriangle className="w-3 h-3 mr-1" />}
        {priority.charAt(0) + priority.slice(1).toLowerCase()}
      </span>
    );
  };

  const getStatusBadge = (status: TicketStatus) => {
    const classes = {
      OPEN: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      RESOLVED: 'bg-green-100 text-green-800',
      CLOSED: 'bg-gray-100 text-gray-800',
    };
    
    const icons = {
      OPEN: <Clock className="w-3 h-3 mr-1" />,
      IN_PROGRESS: <ClockIcon className="w-3 h-3 mr-1" />,
      RESOLVED: <CheckCircle className="w-3 h-3 mr-1" />,
      CLOSED: <CheckCircle className="w-3 h-3 mr-1" />,
    };
    
    const labels = {
      OPEN: 'Open',
      IN_PROGRESS: 'In Progress',
      RESOLVED: 'Resolved',
      CLOSED: 'Closed',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes[status]}`}>
        {icons[status]}
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="p-4 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Support Tickets</h1>
        
        <div className="mt-3 sm:mt-0 sm:ml-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
          {/* Mobile filter toggle */}
          <div className="lg:hidden w-full mb-2">
            <button 
              className="w-full flex items-center justify-between px-4 py-2 bg-gray-100 rounded-md"
              onClick={() => setShowFilters(!showFilters)}
            >
              <span>Filters</span>
              <svg className={`w-5 h-5 transform ${showFilters ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {/* Filter controls */}
          <div className={`${showFilters ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row gap-2 w-full lg:w-auto`}>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="min-w-[160px] bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg py-2 px-3 text-sm text-gray-700 shadow-sm hover:border-blue-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
            >
              <option value="">All Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
            
            <select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              className="min-w-[160px] bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg py-2 px-3 text-sm text-gray-700 shadow-sm hover:border-blue-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
            >
              <option value="">All Priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
            
            <select
              name="assignedTo"
              value={filters.assignedTo}
              onChange={handleFilterChange}
              className="min-w-[160px] bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg py-2 px-3 text-sm text-gray-700 shadow-sm hover:border-blue-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
            >
              <option value="">All Assignees</option>
              <option value="user-1">Jane Doe</option>
              <option value="user-2">John Smith</option>
              <option value="user-3">Alex Johnson</option>
              <option value="user-4">Sarah Williams</option>
            </select>
            
            <select
              name="tags"
              value={filters.tags}
              onChange={handleFilterChange}
              className="min-w-[160px] bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg py-2 px-3 text-sm text-gray-700 shadow-sm hover:border-blue-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
            >
              <option value="">All Tags</option>
              <option value="billing">Billing</option>
              <option value="technical">Technical</option>
              <option value="account">Account</option>
              <option value="bug">Bug</option>
              <option value="feature-request">Feature Request</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          
          {/* Search box */}
          <div className="relative w-full lg:w-auto">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search tickets..."
              className="w-full bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm hover:border-blue-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="mt-3 sm:mt-0 sm:ml-4">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </button>
        </div>
        </div>
      </div>
      
      {loading ? (
        <div className="px-4 py-12 text-center">
          <div className="animate-pulse flex justify-center">
            <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading tickets...</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="px-4 py-12 text-center">
          <p className="text-gray-600">No tickets found matching your filters</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <Link
                to={`/tickets/${ticket.id}`}
                className="block hover:bg-gray-50 transition duration-150 ease-in-out"
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="truncate">
                      <div className="flex text-sm">
                        <p className="font-medium text-blue-600 truncate">{ticket.title}</p>
                      </div>
                      <div className="mt-2 flex">
                        <div className="flex items-center text-sm text-gray-500">
                          <p>
                            Created by <span className="font-medium">{ticket.createdBy.name}</span> on{' '}
                            <time dateTime={ticket.createdAt}>
                              {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                            </time>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-6 flex flex-shrink-0 flex-col items-end">
                      <div className="flex">
                        {getStatusBadge(ticket.status)}
                        <span className="ml-2">
                          {getPriorityBadge(ticket.priority)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span className="truncate">
                          {ticket.messages.length} messages
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination controls */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * filters.limit + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * filters.limit, totalTickets)}
              </span>{' '}
              of <span className="font-medium">{totalTickets}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                      currentPage === pageNum
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>

      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default TicketList;