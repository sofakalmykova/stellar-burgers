import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
} from '@pages';

import { Preloader } from '@ui';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useEffect, type ReactElement } from 'react';
import type { AppContentProps } from './type';
import type { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError,
} from '../../services/slices/ingridients-slice';
import '../../index.css';
import { fetchUser } from '@/services/slices/user-slice';
import styles from './app.module.css';
import { selectUser, selectIsAuthChecked } from '@/services/slices/user-slice';
import { useParams } from 'react-router-dom';
const App = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const ingredients: TIngredient[] = useSelector(selectIngredients);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredientsError = useSelector(selectIngredientsError);
  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError}
      />
    </div>
  );
};

export default App;

/* Маршруты показываются только когда ингредиенты загружены: без них не
   отрисовать ни конструктор, ни состав заказа. */
const AppContent = ({
  ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }

  return <RouteComponent />;
};
type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children,
}: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);

  if (!isAuthChecked) {
    return null;
  }
  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (onlyUnAuth && user) {
    return <Navigate to="/" replace />;
  }
  return children;
};
const OrderModalWithNumber = () => {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();

  if (!number) return null;

  return (
    <Modal title={`#${number}`} onClose={() => navigate(-1)}>
      <OrderInfo />
    </Modal>
  );
};
const RouteComponent = (): React.JSX.Element => {
  const location = useLocation();
  const backgroundLocation = location.state?.background;
  const navigate = useNavigate();
  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/feed/:number" element={<OrderInfo />} />
        <Route
          path="/ingredients/:id"
          element={
            <>
              <h2 className="text text_type_main-large mb-4">Детали ингредиента</h2>
              <IngredientDetails />
            </>
          }
        />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route path="/feed/:number" element={<OrderModalWithNumber />} />
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <OrderModalWithNumber />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};
