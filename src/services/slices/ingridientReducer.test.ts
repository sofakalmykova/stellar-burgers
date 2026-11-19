import { expect, test, describe } from '@jest/globals';
import ingredientsReducer, { fetchIngredients } from './ingridients-slice';
import type { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: '',
    image_mobile: '',
    image_large: '',
  },
];

describe('Редьюсер слайса ingredientsReducer', () => {
  test('undefined + неизвестный экшен = initialState', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual({ ingredients: [], isLoading: false, error: null });
  });

  test('неизвестный экшен не меняет существующее состояние', () => {
    const prevState = {
      ingredients: mockIngredients,
      isLoading: true,
      error: { message: 'oops' },
    };
    const state = ingredientsReducer(prevState, { type: 'UNKNOWN' });
    expect(state).toEqual(prevState);
  });

  test('pending: включает загрузку и сбрасывает ошибку', () => {
    const prevState = { ingredients: [], isLoading: false, error: { message: 'oops' } };
    const state = ingredientsReducer(prevState, { type: fetchIngredients.pending.type });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('fulfilled: кладёт данные и выключает загрузку', () => {
    const prevState = { ingredients: [], isLoading: true, error: null };
    const state = ingredientsReducer(
      prevState,
      fetchIngredients.fulfilled(mockIngredients, 'requestId')
    );
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  test('rejected: редьюсер не обрабатывает ошибку, состояние не меняется', () => {
    const prevState = { ingredients: mockIngredients, isLoading: true, error: null };
    const state = ingredientsReducer(
      prevState,
      fetchIngredients.rejected(new Error('Ошибка сети'), 'requestId')
    );
    expect(state).toEqual(prevState);
  });
});
