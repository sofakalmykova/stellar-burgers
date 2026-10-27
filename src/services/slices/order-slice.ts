import { orderBurgerApi } from '@/utils/burger-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type { RootState } from '../store';
import type { TOrder } from '@/utils/types';

export const submitOrder = createAsyncThunk(
  'burgerConstructor/submitOrder',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const ingredientIds: string[] = [];
    if (state.burgerConstructor.bun) {
      ingredientIds.push(state.burgerConstructor.bun._id);
      ingredientIds.push(state.burgerConstructor.bun._id);
    }
    state.burgerConstructor.ingredients.forEach((ing) => {
      ingredientIds.push(ing._id);
    });

    const response = await orderBurgerApi(ingredientIds);
    return response.order;
  }
);

type TOrderState = {
  isOrdering: boolean;
  lastOrder: TOrder | null;
  error: string | null;
};

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
    },
  },
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
        state.error = action.error.message ?? 'Ошибка оформления заказа';
      });
  },
});

export default orderSlice.reducer;
export const selectIsOrdering = (state: RootState): boolean => state.order.isOrdering;
export const selectLastOrder = (state: RootState): TOrder | null =>
  state.order.lastOrder;
export const { resetLastOrder } = orderSlice.actions;
