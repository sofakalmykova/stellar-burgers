import {
  fetchUser,
  selectUser,
  selectIsAuthChecked,
  markAuthChecked,
} from '@/services/slices/user-slice';
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
import { useEffect, type ReactElement } from 'react';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from 'react-router-dom';

import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError,
} from '../../services/slices/ingridients-slice';
import { useDispatch, useSelector } from '../../services/store';

import type { AppContentProps } from './type';
import type { TIngredient } from '@utils-types';

import '../../index.css';

import styles from './app.module.css';
const App = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const ingredients: TIngredient[] = useSelector(selectIngredients);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredientsError = useSelector(selectIngredientsError);
  useEffect(() => {
    void dispatch(fetchIngredients());
    const hasAuthToken = !!document.cookie
      .split(';')
      .find((c) => c.trim().startsWith('accessToken='));
    if (hasAuthToken) {
      void dispatch(fetchUser());
    } else {
      dispatch(markAuthChecked());
    }
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
type TLocationState = {
  from?: {
    pathname: string;
  };
};
export const ProtectedRoute = ({
  onlyUnAuth = false,
  children,
}: ProtectedRouteProps): React.JSX.Element => {
  const location = useLocation();
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const state = location.state as TLocationState | null;
  console.log(user);
  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from = state?.from?.pathname ?? '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
const OrderModalWithNumber = (): React.JSX.Element | null => {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();

  if (!number) return null;

  return (
    <Modal
      title={`#${number}`}
      onClose={() => {
        void navigate(-1);
      }}
    >
      <OrderInfo />
    </Modal>
  );
};
type LocationState = {
  background?: Location;
};
const RouteComponent = (): React.JSX.Element => {
  const location = useLocation();
  const backgroundLocation = (location.state as LocationState)?.background;
  const navigate = useNavigate();
  return (
    <>
      <Routes location={backgroundLocation ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/feed/:number" element={<OrderInfo />} />
        <Route
          path="/ingredients/:id"
          element={
            <>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <h2 className="text text_type_main-large  detailHeader">
                  Детали ингредиента
                </h2>
              </div>
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
              <Modal
                title="Детали ингредиента"
                onClose={() => {
                  void navigate(-1);
                }}
              >
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
