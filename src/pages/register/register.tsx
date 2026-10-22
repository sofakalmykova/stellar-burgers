import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useDispatch } from '@/services/store';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '@/services/slices/user-slice';

export const Register = (): React.JSX.Element => {
  const [name, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
     const result = await dispatch(registerUser({ name, email, password }));
      if (registerUser.fulfilled.match(result)) {
      // Успешная регистрация → на главную
      navigate('/');
    }
  };
 

  return (
    <RegisterUI
      errorText=""
      email={email}
      userName={name}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
