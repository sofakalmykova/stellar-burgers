import { createSlice, nanoid } from '@reduxjs/toolkit';
import type {
  TConstructorState,
  TIngredient,
  TConstructorIngredient,
} from '@utils-types';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      prepare(ingredient: TIngredient) {
        return {
          payload: { ...ingredient, id: nanoid() } as TConstructorIngredient,
        };
      },
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        const item = action.payload;
        if (item.type === 'bun') {
          state.bun = item;
        } else {
          state.ingredients.push(item);
        }
      },
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    },

    moveUp(state, action: PayloadAction<string>) {
      const index = state.ingredients.findIndex(
        (ingridient) => ingridient.id === action.payload
      );
      if (index > 0) {
        [state.ingredients[index], state.ingredients[index - 1]] = [
          state.ingredients[index - 1],
          state.ingredients[index],
        ];
      }
    },

    moveDown(state, action: PayloadAction<string>) {
      const index = state.ingredients.findIndex((i) => i.id === action.payload);
      if (index >= 0 && index < state.ingredients.length - 1) {
        [state.ingredients[index], state.ingredients[index + 1]] = [
          state.ingredients[index + 1],
          state.ingredients[index],
        ];
      }
    },
  },
});

export const constructorReducer = constructorSlice.reducer;
export const { addIngredient, removeIngredient, clearConstructor, moveUp, moveDown } =
  constructorSlice.actions;
export const selectConstructorState = (state: RootState) => state.burgerConstructor;
