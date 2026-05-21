import { useState, useEffect } from 'react'
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material'
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { forgotPassword, clearForgotPasswordState } from '@/features/auth/authSlice'
import { PATHS } from '@/routes/paths'
import { useNavigate } from 'react-router'

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLoading, isSuccess, error } = useAppSelector(
    (state) => state.auth.forgotPassword,
  )

  const [email, setEmail] = useState('')

  // Clean up state when leaving the page
  useEffect(() => {
    return () => {
      dispatch(clearForgotPasswordState())
    }
  }, [dispatch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(forgotPassword({ email }))
  }

  if (isSuccess) {
    return (
      <Box textAlign="center">
        <MarkEmailReadOutlinedIcon
          sx={{ fontSize: 56, color: 'success.main', mb: 2 }}
        />
        <Typography variant="h6" fontWeight={700} mb={1}>
          {t('auth.otpSentTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          {t('auth.otpSentDesc', { email })}
        </Typography>
        <Button
          variant="contained"
          fullWidth
          onClick={() =>
            navigate(PATHS.RESET_PASSWORD, { state: { email } })
          }
        >
          {t('auth.enterOtp')}
        </Button>
      </Box>
    )
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h5" fontWeight={700} mb={0.5}>
        {t('auth.forgotPasswordTitle')}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        {t('auth.forgotPasswordDesc')}
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
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
        required
        autoFocus
        autoComplete="email"
        disabled={isLoading}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={isLoading || !email}
        sx={{ mt: 3, py: 1.5 }}
      >
        {isLoading ? (
          <CircularProgress size={22} color="inherit" />
        ) : (
          t('auth.sendOtp')
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
