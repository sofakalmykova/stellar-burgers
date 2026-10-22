import { orderBurgerApi } from '@/utils/burger-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { TOrder } from '@/utils/types';

export const submitOrder = createAsyncThunk(
  'burgerConstructor/submitOrder',
  async(_,{ getState }) => {
    const state = getState() as RootState;
    const items = state.burgerConstructor;
    const ingredientIds: string[] = [];
    if (items.bun) {
      for (let i = 0; i < items.bun.count; i++) {
        ingredientIds.push(items.bun._id);
      }
    }
    items.ingredients.forEach((i) => {
      for (let j = 0; j < i.count; j++) {
        ingredientIds.push(i._id);
      }
    });
const response = await orderBurgerApi(ingredientIds);
    return response.order;
  })

interface TOrderState {
  isOrdering: boolean;
  lastOrder: TOrder | null;
  error: string | null;
}

const initialState: TOrderState = {
  isOrdering: false,
  lastOrder: null,
  error: null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
   resetLastOrder: (state) => {
      state.lastOrder = null;
  }},
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => {
        state.isOrdering = true;
        state.error = null;
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.isOrdering = false;
        state.lastOrder = action.payload; // action.payload уже имеет тип TOrder
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.isOrdering = false;
        state.error = action.error.message || 'Ошибка оформления заказа';
      });
  },
});

export default orderSlice.reducer;
export const selectIsOrdering = (state: RootState) => state.order.isOrdering;
export const selectLastOrder = (state: RootState) => state.order.lastOrder;
export const selectOrderError = (state: RootState) => state.order.error;
export const { resetLastOrder } = orderSlice.actions;