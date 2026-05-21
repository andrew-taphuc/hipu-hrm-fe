import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import appConfig from '@/config/app.config'

const axiosInstance = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Request interceptor — attach access token ────────────────────────────────
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(appConfig.tokenKey)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

// ─── Response interceptor — handle 401 / token refresh ───────────────────────
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token as string)
    }
  })
  failedQueue = []
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return axiosInstance(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const refreshToken = localStorage.getItem(appConfig.refreshTokenKey)
      const { data } = await axios.post(
        `${appConfig.apiBaseUrl}/auth/refresh-token`,
        { refreshToken },
      )
      const newAccessToken: string = data.data.accessToken
      const newRefreshToken: string = data.data.refreshToken
      localStorage.setItem(appConfig.tokenKey, newAccessToken)
      localStorage.setItem(appConfig.refreshTokenKey, newRefreshToken)
      axiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`
      processQueue(null, newAccessToken)
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      return axiosInstance(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      localStorage.removeItem(appConfig.tokenKey)
      localStorage.removeItem(appConfig.refreshTokenKey)
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export default axiosInstance
