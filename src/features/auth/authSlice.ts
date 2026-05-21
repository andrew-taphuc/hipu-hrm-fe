import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, LoginCredentials, LoginResponse, User } from './types'
import axiosInstance from '@/lib/axios'
import appConfig from '@/config/app.config'

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem(appConfig.tokenKey),
  isAuthenticated: !!localStorage.getItem(appConfig.tokenKey),
  isLoading: false,
  error: null,
}

// ─── Async thunks ─────────────────────────────────────────────────────────────

export const login = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<{ data: LoginResponse }>(
      '/auth/login',
      credentials,
    )
    return data.data
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } }
    return rejectWithValue(err.response?.data?.message ?? 'Đăng nhập thất bại')
  }
})

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/auth/logout')
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      return rejectWithValue(err.response?.data?.message ?? 'Đăng xuất thất bại')
    } finally {
      localStorage.removeItem(appConfig.tokenKey)
      localStorage.removeItem(appConfig.refreshTokenKey)
    }
  },
)

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: User; accessToken: string }>,
    ) {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.isAuthenticated = true
      localStorage.setItem(appConfig.tokenKey, action.payload.accessToken)
    },
    clearAuth(state) {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem(appConfig.tokenKey)
      localStorage.removeItem(appConfig.refreshTokenKey)
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.isAuthenticated = true
        localStorage.setItem(appConfig.tokenKey, action.payload.accessToken)
        localStorage.setItem(
          appConfig.refreshTokenKey,
          action.payload.refreshToken,
        )
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Đăng nhập thất bại'
      })
      // logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.accessToken = null
        state.isAuthenticated = false
        state.error = null
      })
  },
})

export const { setCredentials, clearAuth, clearError } = authSlice.actions
export default authSlice.reducer
