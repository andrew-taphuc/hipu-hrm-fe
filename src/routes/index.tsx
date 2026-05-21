import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import AdminLayout from '@/layouts/AdminLayout'
import AuthLayout from '@/layouts/AuthLayout'
import LoginPage from '@/features/auth/pages/LoginPage'
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage'
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import { useAppSelector } from '@/hooks/useAppSelector'
import { PATHS } from './paths'

// ─── Layout guards ────────────────────────────────────────────────────────────

/** Chỉ cho vào nếu đã đăng nhập, ngược lại redirect về /login */
function PrivateLayout() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  if (!isAuthenticated) return <Navigate to={PATHS.LOGIN} replace />
  return <AdminLayout />
}

/** Chỉ cho vào nếu chưa đăng nhập, ngược lại redirect về dashboard */
function PublicLayout() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  if (isAuthenticated) return <Navigate to={PATHS.DASHBOARD} replace />
  return <AuthLayout />
}

// ─── Router ───────────────────────────────────────────────────────────────────

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages — guest only */}
        <Route element={<PublicLayout />}>
          <Route path={PATHS.LOGIN} element={<LoginPage />} />
          <Route path={PATHS.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={PATHS.RESET_PASSWORD} element={<ResetPasswordPage />} />
        </Route>

        {/* Admin pages — authenticated only */}
        <Route element={<PrivateLayout />}>
          <Route path={PATHS.DASHBOARD} element={<DashboardPage />} />
          {/* Add more admin routes here */}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={PATHS.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
