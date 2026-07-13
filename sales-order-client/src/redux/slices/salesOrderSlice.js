import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getSalesOrders,
  getSalesOrderById,
  createSalesOrder,
  updateSalesOrder,
} from '../../services/salesOrderService';

export const fetchSalesOrders = createAsyncThunk('salesOrders/fetchAll', async () => {
  return await getSalesOrders();
});

export const fetchSalesOrderById = createAsyncThunk('salesOrders/fetchById', async (id) => {
  return await getSalesOrderById(id);
});

export const addSalesOrder = createAsyncThunk('salesOrders/create', async (orderData) => {
  return await createSalesOrder(orderData);
});

export const editSalesOrder = createAsyncThunk(
  'salesOrders/update',
  async ({ id, orderData }) => {
    return await updateSalesOrder(id, orderData);
  }
);

const salesOrderSlice = createSlice({
  name: 'salesOrders',
  initialState: {
    items: [],
    currentOrder: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSalesOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchSalesOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchSalesOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      .addCase(addSalesOrder.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(editSalesOrder.fulfilled, (state, action) => {
        const index = state.items.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      });
  },
});

export const { clearCurrentOrder } = salesOrderSlice.actions;
export default salesOrderSlice.reducer;