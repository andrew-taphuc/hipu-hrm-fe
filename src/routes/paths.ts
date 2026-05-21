export const PATHS = {
  // Auth
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Admin
  DASHBOARD: '/',
  EMPLOYEES: '/employees',
  DEPARTMENTS: '/departments',
  PAYROLL: '/payroll',
  LEAVE: '/leave',
  USERS: '/users',
  SETTINGS: '/settings',
  PROFILE: '/profile',
} as const

export type PathValue = (typeof PATHS)[keyof typeof PATHS]
