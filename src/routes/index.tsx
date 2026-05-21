import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import AdminLayout from '@/layouts/AdminLayout'
import AuthLayout from '@/layouts/AuthLayout'
import LoginPage from '@/features/auth/pages/LoginPage'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import { PATHS } from './paths'

// ─── Router ───────────────────────────────────────────────────────────────────
// TODO: Re-enable auth guards (PrivateLayout / PublicLayout) when auth is ready.

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages */}
        <Route element={<AuthLayout />}>
          <Route path={PATHS.LOGIN} element={<LoginPage />} />
        </Route>

        {/* Admin pages */}
        <Route element={<AdminLayout />}>
          <Route path={PATHS.DASHBOARD} element={<DashboardPage />} />
          {/* Add more admin routes here */}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={PATHS.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
