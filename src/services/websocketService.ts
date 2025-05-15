import { Client, IMessage } from '@stomp/stompjs';
import { store } from '../store';
import { receiveRealTimeMessage, updateTicketStatus } from '../store/slices/ticketsSlice';
import { addNotification } from '../store/slices/notificationsSlice';
import { v4 as uuidv4 } from 'uuid';

// Get WebSocket URL from environment variables
const SOCKET_URL = import.meta.env.VITE_WS_URL;

let stompClient: Client | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

export const initializeWebSocket = () => {
  if (stompClient) {
    return;
  }

  // For demo purposes, mock WebSocket connection
  console.log('Initializing mock WebSocket connection...');
  
  // Simulate successful connection
  setTimeout(() => {
    console.log('WebSocket connected successfully (mocked)');
    
    // Instead of actual WebSocket events, set up a timer to simulate incoming messages
    simulateIncomingMessages();
  }, 1000);
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    console.log('WebSocket disconnected');
  }
};

// For demo purposes, let's simulate receiving WebSocket messages
function simulateIncomingMessages() {
  const messageTypes = [
    'new-message',
    'status-update',
    'ticket-assignment'
  ];
  
  // Simulate a new event every 30-60 seconds
  setInterval(() => {
    const messageType = messageTypes[Math.floor(Math.random() * messageTypes.length)];
    const { tickets } = store.getState().tickets;
    
    if (tickets.length === 0) return;
    
    // Pick a random ticket
    const randomTicket = tickets[Math.floor(Math.random() * tickets.length)];
    
    switch (messageType) {
      case 'new-message':
        // Simulate receiving a new message on a ticket
        store.dispatch(receiveRealTimeMessage({
          ticketId: randomTicket.id,
          message: {
            id: uuidv4(),
            content: 'This is a simulated real-time message from the WebSocket.',
            createdAt: new Date().toISOString(),
            sender: {
              id: 'system',
              name: 'System',
              email: 'system@example.com',
              role: 'AGENT',
            }
          }
        }));
        
        // Also add a notification
        store.dispatch(addNotification({
          id: uuidv4(),
          message: `New message on ticket: ${randomTicket.title}`,
          type: 'info',
          ticketId: randomTicket.id
        }));
        break;
        
      case 'status-update':
        // Simulate a status update
        const newStatus = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'][Math.floor(Math.random() * 4)];
        store.dispatch(updateTicketStatus({
          ticketId: randomTicket.id,
          status: newStatus as any
        }));
        
        // Add notification
        store.dispatch(addNotification({
          id: uuidv4(),
          message: `Status updated to ${newStatus} for ticket: ${randomTicket.title}`,
          type: 'success',
          ticketId: randomTicket.id
        }));
        break;
        
      case 'ticket-assignment':
        // Add notification for ticket assignment
        store.dispatch(addNotification({
          id: uuidv4(),
          message: `Ticket assigned to you: ${randomTicket.title}`,
          type: 'warning',
          ticketId: randomTicket.id
        }));
        break;
    }
  }, Math.random() * 30000 + 30000); // Random interval between 30-60 seconds
}

// In a real application, these functions would actually send messages to the WebSocket
export const sendMessage = (ticketId: string, message: string) => {
  if (!stompClient) {
    console.log('WebSocket not connected. Trying to reconnect...');
    initializeWebSocket();
    return false;
  }
  
  console.log(`Sending message to ticket ${ticketId}: ${message}`);
  return true;
};

export const subscribeToTicketUpdates = (ticketId: string) => {
  console.log(`Subscribing to updates for ticket ${ticketId}`);
  // In a real app, this would subscribe to a specific ticket channel
};

export const unsubscribeFromTicketUpdates = (ticketId: string) => {
  console.log(`Unsubscribing from updates for ticket ${ticketId}`);
  // In a real app, this would unsubscribe from a specific ticket channel
};