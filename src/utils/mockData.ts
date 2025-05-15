import { Ticket, User, TicketStatus, TicketPriority } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Mock Users
const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    role: 'AGENT',
    avatarUrl: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: 'user-2',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'CUSTOMER',
    avatarUrl: 'https://i.pravatar.cc/150?img=8'
  },
  {
    id: 'user-3',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'ADMIN',
    avatarUrl: 'https://i.pravatar.cc/150?img=3'
  },
  {
    id: 'user-4',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    role: 'AGENT',
    avatarUrl: 'https://i.pravatar.cc/150?img=9'
  }
];

// Helper to create realistic mock messages
const createMockMessages = (ticketId: string, count: number) => {
  const messages = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    const hoursAgo = count - i;
    const createdAt = new Date(now.getTime() - hoursAgo * 3600000).toISOString();
    
    messages.push({
      id: `msg-${ticketId}-${i}`,
      content: getRandomMessage(i, count),
      createdAt,
      sender: user
    });
  }
  
  return messages;
};

// Random message content
const getRandomMessage = (index: number, total: number) => {
  if (index === 0) {
    return "I'm having an issue with the system. Can you help me?";
  }
  
  if (index === total - 1) {
    return "Thanks for your help! I'll try that and let you know if it works.";
  }
  
  const messages = [
    "Could you provide more details about the error you're seeing?",
    "I've checked your account and everything seems to be in order.",
    "Have you tried clearing your cache and cookies?",
    "Let me check with the development team and get back to you.",
    "Can you please tell me which browser and version you're using?",
    "I've replicated the issue on my end. We'll work on a fix.",
    "Could you send a screenshot of the error message?",
    "We've identified the issue. It should be fixed in the next update.",
    "Have you tried using a different browser?",
    "Our team is currently investigating this issue."
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};

// Generate a set of realistic mock tickets
export const mockTickets: Ticket[] = Array.from({ length: 25 }, (_, i) => {
  const id = `ticket-${i + 1}`;
  const statusOptions: TicketStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  const priorityOptions: TicketPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  
  const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
  const priority = priorityOptions[Math.floor(Math.random() * priorityOptions.length)];
  const createdBy = mockUsers[1]; // Customer
  const assignedTo = status !== 'OPEN' ? mockUsers[0] : undefined; // Agent
  
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 14); // Up to 2 weeks ago
  const createdAt = new Date(now.getTime() - daysAgo * 24 * 3600000).toISOString();
  const updatedAt = new Date(now.getTime() - Math.floor(Math.random() * daysAgo) * 24 * 3600000).toISOString();
  
  const tags = [];
  const tagOptions = ['billing', 'technical', 'account', 'bug', 'feature-request', 'urgent'];
  const tagCount = Math.floor(Math.random() * 3); // 0 to 2 tags
  
  for (let j = 0; j < tagCount; j++) {
    const tag = tagOptions[Math.floor(Math.random() * tagOptions.length)];
    if (!tags.includes(tag)) {
      tags.push(tag);
    }
  }
  
  // Generate 2-5 messages per ticket
  const messageCount = Math.floor(Math.random() * 4) + 2;
  const messages = createMockMessages(id, messageCount);
  
  return {
    id,
    title: `Ticket ${i + 1}: ${getRandomTicketTitle()}`,
    description: getRandomTicketDescription(),
    status,
    priority,
    createdAt,
    updatedAt,
    createdBy,
    assignedTo,
    tags,
    messages
  };
});

// Helper for random ticket titles
function getRandomTicketTitle() {
  const titles = [
    "Can't access my account",
    "Error when submitting payment",
    "Feature request: Dark mode",
    "Website is loading slowly",
    "Missing order confirmation",
    "Product question",
    "Billing discrepancy",
    "Login issues after password reset",
    "App crashes on startup",
    "Need help with integration"
  ];
  
  return titles[Math.floor(Math.random() * titles.length)];
}

// Helper for random ticket descriptions
function getRandomTicketDescription() {
  const descriptions = [
    "I've been trying to log in to my account for the past hour, but I keep getting an 'Invalid Credentials' error even though I'm sure my password is correct.",
    "When I try to submit my payment, the page just refreshes and doesn't confirm if the payment went through. I checked my bank account and I haven't been charged yet.",
    "It would be great if you could add a dark mode option. The bright interface is hard on the eyes when working late at night.",
    "The website has been extremely slow for the past few days. Pages take at least 10 seconds to load, and sometimes they time out completely.",
    "I placed an order yesterday (Order #12345) but I haven't received any confirmation email yet. Can you check if my order went through?",
    "I'm considering purchasing your premium plan but I have a few questions about the features before I commit.",
    "I was charged $59.99 for my subscription, but according to your pricing page, it should be $49.99. Can you please explain this discrepancy?",
    "After resetting my password, I still can't log in to my account. The system accepts my new password but then redirects me back to the login page.",
    "Every time I try to open the mobile app, it crashes immediately. I've tried reinstalling it but the problem persists.",
    "I'm trying to integrate your API with our system, but I'm getting a 403 error. I've double-checked my API key and it seems to be correct."
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

// Helper for generating mock notifications
export const createMockNotification = () => {
  const types = ['success', 'error', 'warning', 'info'] as const;
  const messages = [
    'New ticket assigned to you',
    'Ticket status updated',
    'New reply on your ticket',
    'Ticket priority changed',
    'System maintenance scheduled'
  ];
  
  return {
    id: uuidv4(),
    message: messages[Math.floor(Math.random() * messages.length)],
    type: types[Math.floor(Math.random() * types.length)],
    ticketId: `ticket-${Math.floor(Math.random() * 25) + 1}`
  };
};