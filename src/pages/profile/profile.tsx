import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '@/services/store';
import { updateUser } from '@/services/slices/user-slice';

export const Profile = (): React.JSX.Element => {
  /** TODO: Взять переменную из стора */
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (user) {
      setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || '',
    })); 
    }
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();
    if (!user) return;
    try {
      await dispatch(updateUser({
        name: formValue.name,
        email: formValue.email,
        
        ...(formValue.password && { password: formValue.password }),
      })).unwrap();
      console.log('Профиль успешно обновлён');
      
    } catch (error) {
      console.error('Ошибка обновления профиля', error);
    }
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: '',
      });
    }; 
  }
    

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
