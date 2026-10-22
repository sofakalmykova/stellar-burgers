import { ProfileMenuUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '@/services/store';
import { logout } from '@/services/slices/user-slice';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async (): Promise<void> => {
    // TODO: Разлогинить пользователя
    await dispatch(logout());
    navigate('/login', { replace: true })
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
