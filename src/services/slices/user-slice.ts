import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
} from '@/utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { setCookie, deleteCookie } from '../../utils/cookie';

import type { TUser } from '../../utils/types';
import type { RootState } from '../store';
import type { TLoginData, TRegisterData /*TUserResponse*/ } from '@/utils/burger-api';

type TUserState = {
  isAuthChecked: boolean;
  user: TUser | null;
  error: string | null;
};

export const initialState: TUserState = {
  isAuthChecked: false,
  user: null,
  error: null,
};

export const fetchUser = createAsyncThunk('user/fetchUser', () =>
  getUserApi().then((res) => res.user)
);

export const loginUser = createAsyncThunk('user/login', async (data: TLoginData) => {
  const res = await loginUserApi(data);
  setCookie('accessToken', res.accessToken);
  localStorage.setItem('refreshToken', res.refreshToken);
  return res.user;
});

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => {
    const res = await updateUserApi(data);
    return res.user;
  }
);

export const logout = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    markAuthChecked: (state) => {
      state.isAuthChecked = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message ?? 'Ошибка входа';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.error = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error.message ?? 'Ошибка регистрации';
        state.isAuthChecked = true;
      });
  },
});

export default userSlice.reducer;
export const selectUser = (state: RootState): TUser | null => state.user.user;
export const selectIsAuthChecked = (state: RootState): boolean =>
  state.user.isAuthChecked;
export const { markAuthChecked } = userSlice.actions;
