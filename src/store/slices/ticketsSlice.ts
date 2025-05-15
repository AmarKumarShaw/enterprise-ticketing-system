import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Ticket, TicketFilterParams, PaginatedResponse } from '../../types';
import { mockTickets } from '../../utils/mockData';
import { v4 as uuidv4 } from 'uuid';

interface TicketsState {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  loading: boolean;
  error: string | null;
  totalTickets: number;
  currentPage: number;
  totalPages: number;
}

const initialState: TicketsState = {
  tickets: [],
  selectedTicket: null,
  loading: false,
  error: null,
  totalTickets: 0,
  currentPage: 1,
  totalPages: 1,
};

export const createTicket = createAsyncThunk(
  'tickets/createTicket',
  async (ticketData: Partial<Ticket>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const newTicket: Ticket = {
      id: uuidv4(),
      title: ticketData.title!,
      description: ticketData.description!,
      status: 'OPEN',
      priority: ticketData.priority!,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: {
        id: 'user-1',
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'CUSTOMER'
      },
      tags: ticketData.tags || [],
      messages: []
    };
    mockTickets.push(newTicket);

    return newTicket;
  }
);

export const updateTicket = createAsyncThunk(
  'tickets/updateTicket',
  async (ticketData: Partial<Ticket> & { id: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return ticketData;
  }
);

// In a real app, this would call an API instead of using mock data
export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async (params: TicketFilterParams) => {
    // Simulating API call with mock data and filtering
    const start = (params.page - 1) * params.limit;
    const end = start + params.limit;
    
    // Filter logic based on params
    let filteredTickets = [...mockTickets];
    
    if (params.status) {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === params.status);
    }
    
    if (params.priority) {
      filteredTickets = filteredTickets.filter(ticket => ticket.priority === params.priority);
    }
    
    if (params.assignedTo) {
      filteredTickets = filteredTickets.filter(ticket => 
        ticket.assignedTo && ticket.assignedTo.id === params.assignedTo
      );
    }
    
    if (params.tags) {
      filteredTickets = filteredTickets.filter(ticket => 
        ticket.tags.some(tag => tag.toLowerCase() === params.tags.toLowerCase())
      );
    }
    
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredTickets = filteredTickets.filter(
        ticket => 
          ticket.title.toLowerCase().includes(searchLower) || 
          ticket.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort logic
    if (params.sortBy) {
      filteredTickets.sort((a: any, b: any) => {
        const aValue = a[params.sortBy!];
        const bValue = b[params.sortBy!];
        
        if (typeof aValue === 'string') {
          return params.sortOrder === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }
        
        return params.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }
    
    // Pagination
    const paginatedTickets = filteredTickets.slice(start, end);
    
    // Simulate API response format
    const response: PaginatedResponse<Ticket> = {
      data: paginatedTickets,
      total: filteredTickets.length,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(filteredTickets.length / params.limit)
    };
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return response;
  }
);

export const fetchTicketById = createAsyncThunk(
  'tickets/fetchTicketById',
  async (ticketId: string) => {
    // Simulate API call to get a specific ticket
    const ticket = mockTickets.find(ticket => ticket.id === ticketId);
    
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return ticket;
  }
);

export const addMessageToTicket = createAsyncThunk(
  'tickets/addMessageToTicket',
  async ({ ticketId, message }: { ticketId: string, message: string }) => {
    // This would be an API call in a real application
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      ticketId,
      message: {
        id: Math.random().toString(36).substring(2, 11),
        content: message,
        createdAt: new Date().toISOString(),
        sender: {
          id: 'current-user',
          name: 'Current User',
          email: 'user@example.com',
          role: 'AGENT' as const,
          avatarUrl: 'https://i.pravatar.cc/150?img=2'
        }
      }
    };
  }
);

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setSelectedTicket: (state, action: PayloadAction<Ticket | null>) => {
      state.selectedTicket = action.payload;
    },
    receiveRealTimeMessage: (state, action: PayloadAction<{ ticketId: string, message: any }>) => {
      const { ticketId, message } = action.payload;
      
      // Update the message in the tickets list
      const ticketIndex = state.tickets.findIndex(ticket => ticket.id === ticketId);
      if (ticketIndex !== -1) {
        state.tickets[ticketIndex].messages.push(message);
      }
      
      // Update the selected ticket if it matches
      if (state.selectedTicket && state.selectedTicket.id === ticketId) {
        state.selectedTicket.messages.push(message);
      }
    },
    updateTicketStatus: (state, action: PayloadAction<{ ticketId: string, status: Ticket['status'] }>) => {
      const { ticketId, status } = action.payload;
      
      // Update in tickets list
      const ticketIndex = state.tickets.findIndex(ticket => ticket.id === ticketId);
      if (ticketIndex !== -1) {
        state.tickets[ticketIndex].status = status;
      }
      
      // Update in selected ticket
      if (state.selectedTicket && state.selectedTicket.id === ticketId) {
        state.selectedTicket.status = status;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets.unshift(action.payload);
        state.totalTickets += 1;
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create ticket';
      })
      .addCase(updateTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tickets.findIndex(ticket => ticket.id === action.payload.id);
        if (index !== -1) {
          state.tickets[index] = { ...state.tickets[index], ...action.payload };
        }
        if (state.selectedTicket?.id === action.payload.id) {
          state.selectedTicket = { ...state.selectedTicket, ...action.payload };
        }
      })
      .addCase(updateTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update ticket';
      })
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload.data;
        state.totalTickets = action.payload.total;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tickets';
      })
      .addCase(fetchTicketById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTicket = action.payload;
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch ticket';
      })
      .addCase(addMessageToTicket.fulfilled, (state, action) => {
        const { ticketId, message } = action.payload;
        
        // If the ticket is currently selected, add the message to it
        if (state.selectedTicket && state.selectedTicket.id === ticketId) {
          state.selectedTicket.messages.push(message);
        }
        
        // Also update the ticket in the list
        const ticketIndex = state.tickets.findIndex(ticket => ticket.id === ticketId);
        if (ticketIndex !== -1) {
          state.tickets[ticketIndex].messages.push(message);
        }
      });
  }
});

export const { setSelectedTicket, receiveRealTimeMessage, updateTicketStatus } = ticketsSlice.actions;
export default ticketsSlice.reducer;