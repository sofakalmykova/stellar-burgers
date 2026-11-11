import {
  selectConstructorState,
  clearConstructor,
} from '@/services/slices/constructor-slice';
import {
  submitOrder,
  selectIsOrdering,
  selectLastOrder,
  resetLastOrder,
} from '@/services/slices/order-slice';
import { useSelector, useDispatch } from '@/services/store';
import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import type { RootState } from '@/services/store';
import type { TConstructorIngredient, TConstructorState, TOrder } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  /** TODO: Взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems: TConstructorState = useSelector(selectConstructorState);
  const orderRequest = useSelector(selectIsOrdering);
  const orderModalData: TOrder | null = useSelector(selectLastOrder);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;
    // TODO: Оформить заказ

    if (!user) {
      navigate('/login', { state: { from: '/constructor' } });
      return;
    }
    void dispatch(submitOrder())
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const closeOrderModal = (): void => {
    dispatch(resetLastOrder()); // TODO: Закрыть модальное окно и сбросить заказ
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
