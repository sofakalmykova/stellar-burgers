import { selectUserOrders, fetchUserOrders } from '@/services/slices/userOrder-slice';
import { useSelector, useDispatch } from '@/services/store';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import type { TOrder } from '@utils-types';
export const ProfileOrders = (): React.JSX.Element => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();

  const orders: TOrder[] = useSelector(selectUserOrders);
  useEffect(() => {
    if (!orders || orders.length === 0) {
      void dispatch(fetchUserOrders());
    }
  }, [dispatch, orders]);

  return <ProfileOrdersUI orders={orders} />;
};
