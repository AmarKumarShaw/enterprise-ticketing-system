import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserRole } from '../../types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: true, // For demo purposes, we'll start authenticated
  user: {
    id: 'user-1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    role: 'AGENT' as UserRole,
    avatarUrl: 'https://i.pravatar.cc/150?img=5'
  },
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    setRole: (state, action: PayloadAction<UserRole>) => {
      if (state.user) {
        state.user.role = action.payload;
      }
    }
  },
});

export const { setUser, logout, setRole } = authSlice.actions;
export default authSlice.reducer;