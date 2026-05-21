import { useState, useEffect } from 'react'
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Link,
  InputAdornment,
  IconButton,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { resetPassword, clearResetPasswordState } from '@/features/auth/authSlice'
import { PATHS } from '@/routes/paths'

export default function ResetPasswordPage() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoading, isSuccess, error } = useAppSelector(
    (state) => state.auth.resetPassword,
  )

  const [form, setForm] = useState({
    email: (location.state as { email?: string })?.email ?? '',
    otp: '',
    newPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  // Clean up state when leaving the page
  useEffect(() => {
    return () => {
      dispatch(clearResetPasswordState())
    }
  }, [dispatch])

  // Auto-redirect to login after success
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => navigate(PATHS.LOGIN), 3000)
      return () => clearTimeout(timer)
    }
  }, [isSuccess, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(resetPassword(form))
  }

  if (isSuccess) {
    return (
      <Box textAlign="center">
        <CheckCircleOutlineIcon
          sx={{ fontSize: 56, color: 'success.main', mb: 2 }}
        />
        <Typography variant="h6" fontWeight={700} mb={1}>
          {t('auth.resetSuccessTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          {t('auth.resetSuccessDesc')}
        </Typography>
        <Button variant="contained" fullWidth onClick={() => navigate(PATHS.LOGIN)}>
          {t('auth.backToLogin')}
        </Button>
      </Box>
    )
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h5" fontWeight={700} mb={0.5}>
        {t('auth.resetPasswordTitle')}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        {t('auth.resetPasswordDesc')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
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
        autoComplete="email"
        disabled={isLoading}
      />

      <TextField
        fullWidth
        label={t('auth.otp')}
        name="otp"
        value={form.otp}
        onChange={handleChange}
        margin="normal"
        required
        inputProps={{ maxLength: 6, inputMode: 'numeric' }}
        disabled={isLoading}
        helperText={t('auth.otpHelperText')}
      />

      <TextField
        fullWidth
        label={t('auth.newPassword')}
        name="newPassword"
        type={showPassword ? 'text' : 'password'}
        value={form.newPassword}
        onChange={handleChange}
        margin="normal"
        required
        disabled={isLoading}
        inputProps={{ minLength: 6 }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((s) => !s)}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={isLoading || !form.email || !form.otp || !form.newPassword}
        sx={{ mt: 3, py: 1.5 }}
      >
        {isLoading ? (
          <CircularProgress size={22} color="inherit" />
        ) : (
          t('auth.resetPassword')
        )}
      </Button>

      <Box textAlign="center" mt={2}>
        <Link
          component="button"
          type="button"
          variant="body2"
          underline="hover"
          onClick={() => navigate(PATHS.LOGIN)}
        >
          {t('auth.backToLogin')}
        </Link>
      </Box>
    </Box>
  )
}
