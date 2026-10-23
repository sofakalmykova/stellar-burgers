import { useSelector, useDispatch } from '@/services/store';
import { ProfileOrdersUI } from '@ui-pages';
import { selectUserOrders } from '@/services/slices/userOrder-slice';
import type { TOrder } from '@utils-types';
import { fetchUserOrders } from '@/services/slices/userOrder-slice';
import { useEffect } from 'react';
export const ProfileOrders = (): React.JSX.Element => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();

  const orders: TOrder[] = useSelector(selectUserOrders);
  useEffect(() => {
    if (!orders || orders.length === 0) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, orders]);

  return <ProfileOrdersUI orders={orders} />;
};
