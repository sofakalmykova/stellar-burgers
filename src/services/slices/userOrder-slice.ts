import { getOrdersApi } from '@/utils/burger-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type { RootState } from '../store';
import type { TOrder } from '@/utils/types';

type TUserOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserOrdersState = {
  orders: [],
  isLoading: false,
  error: null,
};

export const fetchUserOrders = createAsyncThunk('profile/fetchUserOrders', async () => {
  return await getOrdersApi();
});

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Ошибка загрузки истории';
      });
  },
});
export const userOrderReducer = userOrdersSlice.reducer;
export const selectUserOrders = (state: RootState): TOrder[] => state.userOrders.orders;
export const selectUserOrdersIsLoading = (state: RootState): boolean =>
  state.userOrders.isLoading;
