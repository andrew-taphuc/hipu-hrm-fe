import appConfig from '@/config/app.config'
import { authApi } from '../api/auth.api'
import type {
  LoginCredentials,
  LoginResponse,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from '../types'

/**
 * Service layer — business logic: gọi authApi + quản lý token trong localStorage.
 * Slice / component chỉ tương tác qua layer này, không dùng authApi trực tiếp.
 */
export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await authApi.login(credentials)
    const result = data.data
    authService.saveTokens(result.accessToken, result.refreshToken)
    return result
  },

  async logout(): Promise<void> {
    const refreshToken = authService.getRefreshToken() ?? ''
    try {
      await authApi.logout(refreshToken)
    } finally {
      authService.clearTokens()
    }
  },

  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = authService.getRefreshToken() ?? ''
    const { data } = await authApi.refreshToken(refreshToken)
    const result = data.data
    authService.saveTokens(result.accessToken, result.refreshToken)
    return result
  },

  async forgotPassword(payload: ForgotPasswordRequest): Promise<void> {
    await authApi.forgotPassword(payload)
  },

  async resetPassword(payload: ResetPasswordRequest): Promise<void> {
    await authApi.resetPassword(payload)
  },

  async changePassword(payload: ChangePasswordRequest): Promise<void> {
    await authApi.changePassword(payload)
  },

  // ─── Token helpers ──────────────────────────────────────────────────────────

  saveTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(appConfig.tokenKey, accessToken)
    localStorage.setItem(appConfig.refreshTokenKey, refreshToken)
  },

  clearTokens() {
    localStorage.removeItem(appConfig.tokenKey)
    localStorage.removeItem(appConfig.refreshTokenKey)
  },

  getAccessToken() {
    return localStorage.getItem(appConfig.tokenKey)
  },

  getRefreshToken() {
    return localStorage.getItem(appConfig.refreshTokenKey)
  },

  isLoggedIn() {
    return !!authService.getAccessToken()
  },
}
