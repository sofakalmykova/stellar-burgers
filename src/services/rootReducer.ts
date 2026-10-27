// TODO: Заменить на настоящий корневой редьюсер
import { combineReducers } from '@reduxjs/toolkit';

//import { BurgerConstructor } from '@/components';
import { constructorReducer } from './slices/constructor-slice';
import { feedReducer } from './slices/feed-slice';
import ingredientsReducer from './slices/ingridients-slice';
import orderReducer from './slices/order-slice';
import { orderInfoReducer } from './slices/orderInfo-slice';
import userReducer from './slices/user-slice';
import { userOrderReducer } from './slices/userOrder-slice';
export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  user: userReducer,
  order: orderReducer,
  feed: feedReducer,
  userOrders: userOrderReducer,
  orderInfo: orderInfoReducer,
});
// TODO: Собрать здесь редьюсеры слайсов
