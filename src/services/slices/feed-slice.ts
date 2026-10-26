import { getFeedsApi } from '@/utils/burger-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type { RootState } from '../store';
import type { TOrder } from '@/utils/types';

export type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
};

export const fetchFeed = createAsyncThunk('feed/fetch', async () => {
  return await getFeedsApi();
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        const { orders, total, totalToday } = action.payload;
        state.orders = orders;
        state.total = total;
        state.totalToday = totalToday;
        state.isLoading = false;
      })
      .addCase(fetchFeed.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Ошибка загрузки ленты';
      });
  },
});

export const feedReducer = feedSlice.reducer;
export const selectFeedOrders = (state: RootState): TOrder[] => state.feed.orders;
export const selectFeedTotal = (state: RootState): number => state.feed.total;
export const selectFeedTotalToday = (state: RootState): number => state.feed.totalToday;
export const selectFeedIsLoading = (state: RootState): boolean => state.feed.isLoading;
export const selectFeedError = (state: RootState): string | null => state.feed.error;
