import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getItems } from '../../services/itemService';

export const fetchItems = createAsyncThunk('items/fetchItems', async () => {
  return await getItems();
});

const itemSlice = createSlice({
  name: 'items',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default itemSlice.reducer;