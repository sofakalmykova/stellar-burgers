import { logout } from '@/services/slices/user-slice';
import { useDispatch } from '@/services/store';
import { ProfileMenuUI } from '@ui';
import { useLocation } from 'react-router-dom';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const handleLogout = (): void => {
    // TODO: Разлогинить пользователя
    void dispatch(logout());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
