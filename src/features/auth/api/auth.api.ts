import axiosInstance from '@/lib/axios'
import type {
  LoginCredentials,
  LoginResponse,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from '../types'

const PREFIX = '/auth'

/**
 * Raw HTTP layer — chỉ gọi API, không xử lý side effect (localStorage, v.v.)
 */
export const authApi = {
  login(credentials: LoginCredentials) {
    return axiosInstance.post<{ data: LoginResponse }>(
      `${PREFIX}/login`,
      credentials,
    )
  },

  refreshToken(refreshToken: string) {
    return axiosInstance.post<{ data: RefreshTokenResponse }>(
      `${PREFIX}/refresh-token`,
      { refreshToken },
    )
  },

  logout(refreshToken: string) {
    return axiosInstance.post(`${PREFIX}/logout`, { refreshToken })
  },

  forgotPassword(payload: ForgotPasswordRequest) {
    return axiosInstance.post(`${PREFIX}/forgot-password`, payload)
  },

  resetPassword(payload: ResetPasswordRequest) {
    return axiosInstance.post(`${PREFIX}/reset-password`, payload)
  },

  changePassword(payload: ChangePasswordRequest) {
    return axiosInstance.post(`${PREFIX}/change-password`, payload)
  },
}
