import { useState } from 'react'
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { login, clearError } from '@/features/auth/authSlice'
import { PATHS } from '@/routes/paths'

export default function LoginPage() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)

  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) dispatch(clearError())
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(login(form))
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h5" fontWeight={700} mb={0.5}>
        {t('auth.loginTitle')}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        {t('auth.loginSubtitle')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label={t('auth.email')}
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        margin="normal"
        required
        autoFocus
        autoComplete="email"
        disabled={isLoading}
      />

      <TextField
        fullWidth
        label={t('auth.password')}
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        margin="normal"
        required
        autoComplete="current-password"
        disabled={isLoading}
      />

      <Box sx={{ textAlign: 'right', mt: 0.5 }}>
        <Link href={PATHS.FORGOT_PASSWORD} variant="body2" underline="hover">
          {t('auth.forgotPassword')}
        </Link>
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={isLoading}
        sx={{ mt: 3, py: 1.5 }}
      >
        {isLoading ? (
          <CircularProgress size={22} color="inherit" />
        ) : (
          t('auth.login')
        )}
      </Button>
    </Box>
  )
}
