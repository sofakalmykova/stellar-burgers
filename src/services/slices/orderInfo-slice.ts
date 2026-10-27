import { getOrderByNumberApi } from '@/utils/burger-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type { RootState } from '../store';
import type { TOrder } from '@/utils/types';

export const fetchOrderById = createAsyncThunk(
  'orderInfo/fetchById',
  async (idStr: string) => {
    const number = Number(idStr);
    const response = await getOrderByNumberApi(number);
    console.log(response);
    return response.orders[0];
  }
);

type TOrderInfoState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderInfoState = {
  order: null,
  isLoading: false,
  error: null,
};

const orderInfoSlice = createSlice({
  name: 'orderInfo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Не удалось загрузить заказ';
      });
  },
});

export const orderInfoReducer = orderInfoSlice.reducer;

export const selectOrderInfo = (state: RootState): TOrder | null =>
  state.orderInfo.order;
