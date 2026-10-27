import { updateUser } from '@/services/slices/user-slice';
import { useSelector, useDispatch } from '@/services/store';
import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

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

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    if (!user) return;
    void dispatch(
      updateUser({
        name: formValue.name,
        email: formValue.email,
        ...(formValue.password && { password: formValue.password }),
      })
    ).unwrap();
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: '',
      });
    }
  };

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
