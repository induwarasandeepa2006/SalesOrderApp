import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getClients } from '../../services/clientService';

export const fetchClients = createAsyncThunk('clients/fetchClients', async () => {
  return await getClients();
});

const clientSlice = createSlice({
  name: 'clients',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default clientSlice.reducer;