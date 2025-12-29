import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import equipmentReducer from './equipmentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    equipment: equipmentReducer,
  },
});