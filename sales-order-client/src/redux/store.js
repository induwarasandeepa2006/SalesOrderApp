import { configureStore } from '@reduxjs/toolkit';
import clientReducer from './slices/clientSlice';
import itemReducer from './slices/itemSlice';
import salesOrderReducer from './slices/salesOrderSlice';

export const store = configureStore({
  reducer: {
    clients: clientReducer,
    items: itemReducer,
    salesOrders: salesOrderReducer,
  },
});