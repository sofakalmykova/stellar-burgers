import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useDispatch } from '@/services/store';
import { useNavigate, useLocation} from 'react-router-dom';
import { loginUser } from '@/services/slices/user-slice';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      // Сначала смотрим, куда хотели попасть до логина (например, из ProtectedRoute)
      const from = location.state?.from as { pathname: string } | undefined;
      navigate(from?.pathname ?? '/');
    }
  };

  return (
    <LoginUI
      errorText=""
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
