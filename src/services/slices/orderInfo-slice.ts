import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '@/utils/burger-api';
import type { RootState } from "../store";
import type { TOrder } from '@/utils/types';

export const fetchOrderById = createAsyncThunk(
  'orderInfo/fetchById',
  async (idStr: string) => {
      const number = Number(idStr);
      const response = await getOrderByNumberApi(number);
      console.log(response)
      return response.orders[0]; }
);

interface TOrderInfoState {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
}

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
        state.error =  'Не удалось загрузить заказ';
      });
  },
});

export const orderInfoReducer =  orderInfoSlice.reducer;


export const selectOrderInfo = (state: RootState) => state.orderInfo.order;
export const selectOrderInfoLoading = (state: RootState) => state.orderInfo.isLoading;
export const selectOrderInfoError = (state: RootState) => state.orderInfo.error;

