// ─── Domain ───────────────────────────────────────────────────────────────────

export interface User {
  id: number
  email: string
  fullName: string
  avatarUrl: string | null
  roles: string[]
}

// ─── Request payloads ─────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string
  password: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  email: string
  otp: string
  newPassword: string
}

export interface ChangePasswordRequest {
  email: string
  currentPassword: string
  newPassword: string
}

// ─── Response shapes ──────────────────────────────────────────────────────────

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

// ─── Redux state ──────────────────────────────────────────────────────────────

export interface ForgotPasswordState {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}

export interface ResetPasswordState {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}

export interface ChangePasswordState {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  forgotPassword: ForgotPasswordState
  resetPassword: ResetPasswordState
  changePassword: ChangePasswordState
}
