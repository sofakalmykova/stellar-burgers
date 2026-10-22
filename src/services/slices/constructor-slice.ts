import { createSlice, nanoid} from '@reduxjs/toolkit';
import type {  TConstructorState, TIngredient, TConstructorIngredient } from '@utils-types';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
    name: 'burgerConstructor',
    initialState,
    reducers: {
      addIngredient: {
      prepare: (ingredient: TIngredient) => {
        return {
          payload: {
            ...ingredient,
            id: nanoid(),   
            count: 1        
          } as TConstructorIngredient
        };
      },
      
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;

        if (ingredient.type === 'bun') {
          if (state.bun) {
            state.bun.count += 1;
          } else {
            state.bun = ingredient;
          }
          return;
        }

        const existing = state.ingredients.find((i) => i._id === ingredient._id);
        if (existing) {
          existing.count += 1;
        } else {
          state.ingredients.push(ingredient);
        }
      }
    },
    removeIngredient(state, action: PayloadAction<string>) {
  const idToRemove = action.payload;

  state.ingredients = state.ingredients
    .map((item) => {
      if (item._id === idToRemove) {
        return { ...item, count: item.count - 1 };
      }
      return item;
    })
    .filter((item) => item.count > 0);
},

    moveUp(state, action: PayloadAction<string>) {
        const index = state.ingredients.findIndex((ingridient) => ingridient.id === action.payload);
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
clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    },
    }
})
export  const constructorReducer = constructorSlice.reducer
export const { addIngredient, removeIngredient, clearConstructor, moveUp, moveDown } = constructorSlice.actions;
export const selectConstructorState = (state: RootState) => state.burgerConstructor;