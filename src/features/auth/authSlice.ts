import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {
  AuthState,
  LoginCredentials,
  LoginResponse,
  User,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from './types'
import { authService } from './services/auth.service'

const initialState: AuthState = {
  user: null,
  accessToken: authService.getAccessToken(),
  isAuthenticated: authService.isLoggedIn(),
  isLoading: false,
  error: null,
  forgotPassword: { isLoading: false, isSuccess: false, error: null },
  resetPassword: { isLoading: false, isSuccess: false, error: null },
  changePassword: { isLoading: false, isSuccess: false, error: null },
}

// ─── Async thunks ─────────────────────────────────────────────────────────────

export const login = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    return await authService.login(credentials)
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } }
    return rejectWithValue(err.response?.data?.message ?? 'Đăng nhập thất bại')
  }
})

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout()
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      authService.clearTokens()
      return rejectWithValue(
        err.response?.data?.message ?? 'Đăng xuất thất bại',
      )
    }
  },
)

export const forgotPassword = createAsyncThunk<
  void,
  ForgotPasswordRequest,
  { rejectValue: string }
>('auth/forgotPassword', async (payload, { rejectWithValue }) => {
  try {
    await authService.forgotPassword(payload)
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } }
    return rejectWithValue(err.response?.data?.message ?? 'Gửi OTP thất bại')
  }
})

export const resetPassword = createAsyncThunk<
  void,
  ResetPasswordRequest,
  { rejectValue: string }
>('auth/resetPassword', async (payload, { rejectWithValue }) => {
  try {
    await authService.resetPassword(payload)
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } }
    return rejectWithValue(
      err.response?.data?.message ?? 'Đặt lại mật khẩu thất bại',
    )
  }
})

export const changePassword = createAsyncThunk<
  void,
  ChangePasswordRequest,
  { rejectValue: string }
>('auth/changePassword', async (payload, { rejectWithValue }) => {
  try {
    await authService.changePassword(payload)
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } }
    return rejectWithValue(
      err.response?.data?.message ?? 'Đổi mật khẩu thất bại',
    )
  }
})

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
    },
    clearAuth(state) {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
      state.error = null
      authService.clearTokens()
    },
    clearError(state) {
      state.error = null
    },
    clearForgotPasswordState(state) {
      state.forgotPassword = { isLoading: false, isSuccess: false, error: null }
    },
    clearResetPasswordState(state) {
      state.resetPassword = { isLoading: false, isSuccess: false, error: null }
    },
    clearChangePasswordState(state) {
      state.changePassword = { isLoading: false, isSuccess: false, error: null }
    },
  },
  extraReducers: (builder) => {
    builder
      // ─ login
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Đăng nhập thất bại'
      })
      // ─ logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.accessToken = null
        state.isAuthenticated = false
        state.error = null
      })
      // ─ forgotPassword
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPassword = { isLoading: true, isSuccess: false, error: null }
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.forgotPassword = { isLoading: false, isSuccess: true, error: null }
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPassword = {
          isLoading: false,
          isSuccess: false,
          error: action.payload ?? 'Gửi OTP thất bại',
        }
      })
      // ─ resetPassword
      .addCase(resetPassword.pending, (state) => {
        state.resetPassword = { isLoading: true, isSuccess: false, error: null }
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetPassword = { isLoading: false, isSuccess: true, error: null }
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPassword = {
          isLoading: false,
          isSuccess: false,
          error: action.payload ?? 'Đặt lại mật khẩu thất bại',
        }
      })
      // ─ changePassword
      .addCase(changePassword.pending, (state) => {
        state.changePassword = { isLoading: true, isSuccess: false, error: null }
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.changePassword = { isLoading: false, isSuccess: true, error: null }
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.changePassword = {
          isLoading: false,
          isSuccess: false,
          error: action.payload ?? 'Đổi mật khẩu thất bại',
        }
      })
  },
})

export const {
  setCredentials,
  clearAuth,
  clearError,
  clearForgotPasswordState,
  clearResetPasswordState,
  clearChangePasswordState,
} = authSlice.actions
export default authSlice.reducer
