import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

import type { TOrder } from '@utils-types';
import { useSelector, useDispatch } from '@/services/store';
import { fetchFeed } from '@/services/slices/feed-slice';
import { useEffect } from 'react';

export const Feed = (): React.JSX.Element => {
  // TODO: Взять переменную из стора
  const dispatch = useDispatch();
console.log('🎯 Feed: компонент монтируется, запускаем fetchFeed');
  const orders: TOrder[] = useSelector((state) => state.feed.orders);
  console.log('📦 Feed: текущее состояние orders:', orders);
  console.log('🔍 Feed: orders.length =', orders?.length);
  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);
  const handleGetFeeds = (): void => {
    // TODO: Запросить ленту заказов
    dispatch(fetchFeed());
    console.log('click')
  };

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
