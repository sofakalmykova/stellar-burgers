import { fetchFeed } from '@/services/slices/feed-slice';
import { useSelector, useDispatch } from '@/services/store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import type { TOrder } from '@utils-types';

export const Feed = (): React.JSX.Element => {
  // TODO: Взять переменную из стора
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector((state) => state.feed.orders);
  useEffect(() => {
    void dispatch(fetchFeed());
  }, [dispatch]);
  const handleGetFeeds = (): void => {
    // TODO: Запросить ленту заказов
    void dispatch(fetchFeed());
  };

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
