const appConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000',
  appName: import.meta.env.VITE_APP_NAME ?? 'HRM System',
  appVersion: import.meta.env.VITE_APP_VERSION ?? '1.0.0',
  tokenKey: 'access_token',
  refreshTokenKey: 'refresh_token',
  defaultLocale: 'vi',
  supportedLocales: ['vi', 'en'],
} as const

export default appConfig
