import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@/utils/burger-api';
import type { TIngredient } from '@utils-types';
import type { SerializedError } from '@reduxjs/toolkit';
interface IIngredientsState  {
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
        state.ingredients = action.payload;})
        
      }
})
export default ingredientsSlice.reducer;

export const selectIngredients = (state: { ingredients: IIngredientsState }) =>
  state.ingredients.ingredients;
export const selectIngredientsLoading = (state: { ingredients: IIngredientsState }) =>
  state.ingredients.isLoading;
export const selectIngredientsError = (state: { ingredients: IIngredientsState }) =>
  state.ingredients.error;