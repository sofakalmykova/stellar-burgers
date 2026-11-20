import { expect, test, describe } from '@jest/globals';
import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  clearConstructor,
  moveUp,
  moveDown,
} from './constructor-slice';
import type { TIngredient, TConstructorIngredient } from '@utils-types';

const bun: TIngredient = {
  _id: 'bun-1',
  name: 'Флюоресцентная булка R2-D3',
  type: 'bun',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: '',
  image_mobile: '',
  image_large: '',
};

const mainInridient: TIngredient = {
  ...bun,
  _id: 'main-1',
  type: 'main',
  name: 'Биокотлета из марсианской Магнолии',
  price: 4242,
};

const stateWithItems = {
  bun: { ...bun, id: 'bun-id' } as TConstructorIngredient,
  ingredients: [
    { ...mainInridient, id: 'id-1' } as TConstructorIngredient,
    {
      ...mainInridient,
      _id: 'main-2',
      name: 'Филе Люминесцентного тетраодонтимформа',
      id: 'id-2',
    } as TConstructorIngredient,
  ],
};

describe('Редьюсер слайса burgerConstructor', () => {
  test('с undefined и неизвестным экшеном возвращает initialState', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual({ bun: null, ingredients: [] });
  });

  test('неизвестный экшен не изменяет текущее состояние', () => {
    const state = constructorReducer(stateWithItems, { type: 'UNKNOWN' });
    expect(state).toEqual(stateWithItems);
  });

  test('addIngredient: булка попадает в bun, а не в массив ингредиентов', () => {
    const state = constructorReducer({ bun: null, ingredients: [] }, addIngredient(bun));
    expect(state.bun).toEqual({ ...bun, id: expect.any(String) });
    expect(state.ingredients).toHaveLength(0);
  });

  test('addIngredient: начинка добавляется в массив начинок', () => {
    const state = constructorReducer(
      { bun: null, ingredients: [] },
      addIngredient(mainInridient)
    );
    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([{ ...mainInridient, id: expect.any(String) }]);
  });

  test('removeIngredient: удаляет ингредиент по id и не трогает булку', () => {
    const state = constructorReducer(stateWithItems, removeIngredient('id-1'));
    expect(state.ingredients.map((i) => i.id)).toEqual(['id-2']);
    expect(state.bun).toEqual(stateWithItems.bun);
  });

  test('clearConstructor: очищает и булку, и массив ингредиентов', () => {
    const state = constructorReducer(stateWithItems, clearConstructor());
    expect(state).toEqual({ bun: null, ingredients: [] });
  });

  test('moveUp: поднимает ингредиент выше', () => {
    const state = constructorReducer(stateWithItems, moveUp('id-2'));
    expect(state.ingredients.map((i) => i.id)).toEqual(['id-2', 'id-1']);
  });

  test('moveUp: первый элемент не двигается', () => {
    const state = constructorReducer(stateWithItems, moveUp('id-1'));
    expect(state.ingredients.map((i) => i.id)).toEqual(['id-1', 'id-2']);
  });

  test('moveDown: опускает ингредиент ниже', () => {
    const state = constructorReducer(stateWithItems, moveDown('id-1'));
    expect(state.ingredients.map((i) => i.id)).toEqual(['id-2', 'id-1']);
  });

  test('moveDown: последний элемент не двигается', () => {
    const state = constructorReducer(stateWithItems, moveDown('id-2'));
    expect(state.ingredients.map((i) => i.id)).toEqual(['id-1', 'id-2']);
  });
});
