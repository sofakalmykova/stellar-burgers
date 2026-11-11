import { getIngredientsApi } from '@/utils/burger-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type { SerializedError } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils-types';
type IIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: SerializedError | null;
};

const initialState: IIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null,
};

export const fetchIngredients = createAsyncThunk('ingredients/fetchAll', async () =>
  getIngredientsApi()
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      });
  },
});
export default ingredientsSlice.reducer;

export const selectIngredients = (state: {
  ingredients: IIngredientsState;
}): TIngredient[] => state.ingredients.ingredients;
export const selectIngredientsLoading = (state: {
  ingredients: IIngredientsState;
}): boolean => state.ingredients.isLoading;
export const selectIngredientsError = (state: {
  ingredients: IIngredientsState;
}): SerializedError | null => state.ingredients.error;
