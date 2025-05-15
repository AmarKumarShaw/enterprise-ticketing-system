import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTicketById, addMessageToTicket } from '../../store/slices/ticketsSlice';
import { RootState } from '../../store';
import { format } from 'date-fns';
import { AlertTriangle, ArrowLeft, Clock, MessageSquare, Paperclip, Send, Edit } from 'lucide-react';
import { TicketStatus, TicketPriority } from '../../types';
import { subscribeToTicketUpdates, unsubscribeFromTicketUpdates } from '../../services/websocketService';
import EditTicketModal from './EditTicketModal';

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedTicket, loading, error } = useSelector((state: RootState) => state.tickets);
  const { user } = useSelector((state: RootState) => state.auth);
  const [message, setMessage] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchTicketById(id) as any);
      subscribeToTicketUpdates(id);
    }
    
    return () => {
      if (id) {
        unsubscribeFromTicketUpdates(id);
      }
    };
  }, [dispatch, id]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedTicket?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && id) {
      dispatch(addMessageToTicket({ ticketId: id, message: message.trim() }) as any);
      setMessage('');
    }
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case 'LOW':
        return 'bg-gray-100 text-gray-800';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'CRITICAL':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error || !selectedTicket) {
    return (
      <div className="bg-white shadow sm:rounded-lg p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <h3 className="mt-3 text-lg font-medium text-gray-900">Error loading ticket</h3>
          <p className="mt-2 text-sm text-gray-500">{error || 'Ticket not found'}</p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => navigate('/tickets')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tickets
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow sm:rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-start border-b border-gray-200">
        <div>
          <button
            type="button"
            className="inline-flex items-center mr-4 px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => navigate('/tickets')}
          >
            <ArrowLeft className="mr-1 h-4 w-4" aria-hidden="true" />
            Back
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Ticket
          </button>
          <div className="flex space-x-2">
            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${getStatusColor(selectedTicket.status)}`}>
              <Clock className="mr-1 h-4 w-4" />
              {selectedTicket.status === 'IN_PROGRESS' ? 'In Progress' : selectedTicket.status.charAt(0) + selectedTicket.status.slice(1).toLowerCase()}
            </span>
            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${getPriorityColor(selectedTicket.priority)}`}>
              {selectedTicket.priority === 'CRITICAL' && <AlertTriangle className="mr-1 h-4 w-4" />}
              {selectedTicket.priority.charAt(0) + selectedTicket.priority.slice(1).toLowerCase()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedTicket.title}</h3>
        <p className="mt-3 text-sm text-gray-500">{selectedTicket.description}</p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedTicket.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="flex justify-between text-sm text-gray-500">
            <div>
              Created by <span className="font-medium">{selectedTicket.createdBy.name}</span> on{' '}
              <time dateTime={selectedTicket.createdAt}>
                {format(new Date(selectedTicket.createdAt), 'MMM d, yyyy h:mm a')}
              </time>
            </div>
            <div>
              {selectedTicket.assignedTo ? (
                <span>
                  Assigned to <span className="font-medium">{selectedTicket.assignedTo.name}</span>
                </span>
              ) : (
                <span className="text-yellow-600 font-medium">Unassigned</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Messages section */}
      <div className="border-t border-gray-200">
        <div className="px-4 py-3 bg-gray-50 sm:px-6">
          <h4 className="text-md font-medium text-gray-900 flex items-center">
            <MessageSquare className="mr-2 h-5 w-5 text-gray-500" />
            Messages
          </h4>
        </div>
        
        <div className="px-4 py-3 sm:px-6 max-h-96 overflow-y-auto bg-gray-50">
          {selectedTicket.messages.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No messages yet.</p>
          ) : (
            selectedTicket.messages.map((msg) => {
              const isCurrentUser = msg.sender.id === user?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isCurrentUser && (
                    <div className="flex-shrink-0 mr-3">
                      {msg.sender.avatarUrl ? (
                        <img
                          className="h-8 w-8 rounded-full"
                          src={msg.sender.avatarUrl}
                          alt={msg.sender.name}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {msg.sender.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className={`max-w-md ${isCurrentUser ? 'order-first mr-3' : ''}`}>
                    <div
                      className={`px-4 py-2 rounded-lg inline-block ${
                        isCurrentUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    <div
                      className={`mt-1 text-xs text-gray-500 ${
                        isCurrentUser ? 'text-right' : ''
                      }`}
                    >
                      <span className="font-medium">{msg.sender.name}</span> •{' '}
                      {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                    </div>
                  </div>
                  
                  {isCurrentUser && (
                    <div className="flex-shrink-0">
                      {msg.sender.avatarUrl ? (
                        <img
                          className="h-8 w-8 rounded-full"
                          src={msg.sender.avatarUrl}
                          alt={msg.sender.name}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {msg.sender.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="px-4 py-3 sm:px-6 border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="flex">
            <div className="flex-grow relative">
              <textarea
                rows={1}
                name="message"
                id="message"
                className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md py-2 pl-3 pr-10 resize-none"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
              >
                <Paperclip className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <button
              type="submit"
              disabled={!message.trim()}
              className={`ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                message.trim()
                  ? 'text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  : 'text-gray-400 bg-gray-100 cursor-not-allowed'
              }`}
            >
              <Send className="h-4 w-4 mr-1" />
              Send
            </button>
          </form>
        </div>
      </div>

      {selectedTicket && (
        <EditTicketModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          ticket={selectedTicket}
        />
      )}
    </div>
  );
};

export default TicketDetail;