import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { selectConstructorState } from '@/services/slices/constructor-slice';
import type { TConstructorIngredient, TConstructorState, TOrder } from '@utils-types';
import { useSelector, useDispatch } from '@/services/store';
import {
  submitOrder,
  selectIsOrdering,
  selectLastOrder,
} from '@/services/slices/order-slice';
import { useNavigate } from 'react-router-dom';
import { resetLastOrder } from '@/services/slices/order-slice';
import { clearConstructor } from '@/services/slices/constructor-slice';
export const BurgerConstructor = (): React.JSX.Element | null => {
  /** TODO: Взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems: TConstructorState = useSelector(selectConstructorState);
  const orderRequest = useSelector(selectIsOrdering);
  const orderModalData: TOrder | null = useSelector(selectLastOrder);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const onOrderClick = async (): Promise<void> => {
    if (!constructorItems.bun || orderRequest) return;
    // TODO: Оформить заказ

    if (!user) {
      navigate('/login', { state: { from: '/constructor' } });
      return;
    }
    await dispatch(submitOrder()).unwrap();
    dispatch(clearConstructor());
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
