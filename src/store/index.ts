import { configureStore } from '@reduxjs/toolkit';
import ticketsReducer from './slices/ticketsSlice';
import authReducer from './slices/authSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    tickets: ticketsReducer,
    auth: authReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;