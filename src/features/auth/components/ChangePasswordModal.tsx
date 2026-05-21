import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Box,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { changePassword, clearChangePasswordState } from '@/features/auth/authSlice'

interface Props {
  open: boolean
  onClose: () => void
}

const EMPTY_FORM = { currentPassword: '', newPassword: '', confirmPassword: '' }

export default function ChangePasswordModal({ open, onClose }: Props) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const { isLoading, isSuccess, error } = useAppSelector(
    (state) => state.auth.changePassword,
  )

  const [form, setForm] = useState(EMPTY_FORM)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [confirmError, setConfirmError] = useState('')

  // Reset state khi đóng modal
  useEffect(() => {
    if (!open) {
      setForm(EMPTY_FORM)
      setShowCurrent(false)
      setShowNew(false)
      setConfirmError('')
      dispatch(clearChangePasswordState())
    }
  }, [open, dispatch])

  // Tự đóng sau khi đổi thành công
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(onClose, 1500)
      return () => clearTimeout(timer)
    }
  }, [isSuccess, onClose])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (e.target.name === 'confirmPassword') setConfirmError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.newPassword !== form.confirmPassword) {
      setConfirmError(t('auth.passwordMismatch'))
      return
    }
    if (!user?.email) return
    dispatch(changePassword({
      email: user.email,
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    }))
  }

  const isDisabled = isLoading || isSuccess

  const PasswordField = (
    name: 'currentPassword' | 'newPassword' | 'confirmPassword',
    label: string,
    show: boolean,
    toggle: () => void,
  ) => (
    <TextField
      fullWidth
      name={name}
      label={label}
      type={show ? 'text' : 'password'}
      value={form[name]}
      onChange={handleChange}
      margin="dense"
      required
      disabled={isDisabled}
      error={name === 'confirmPassword' && !!confirmError}
      helperText={name === 'confirmPassword' ? confirmError : undefined}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={toggle} edge="end" size="small" tabIndex={-1}>
                {show ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  )

  return (
    <Dialog
      open={open}
      onClose={isDisabled ? undefined : onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{ paper: { sx: { borderRadius: 2 } } }}
    >
      <DialogTitle sx={{ pr: 6 }}>
        {t('auth.changePassword')}
        <IconButton
          onClick={onClose}
          disabled={isDisabled}
          size="small"
          sx={{ position: 'absolute', right: 12, top: 12 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {isSuccess ? (
          <Box textAlign="center" py={2}>
            <CheckCircleOutlineIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
            <Typography fontWeight={600}>{t('auth.changePasswordSuccess')}</Typography>
          </Box>
        ) : (
          <Box component="form" id="change-password-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <Alert severity="error" sx={{ mb: 1.5 }}>
                {error}
              </Alert>
            )}
            {PasswordField(
              'currentPassword',
              t('auth.currentPassword'),
              showCurrent,
              () => setShowCurrent((s) => !s),
            )}
            {PasswordField(
              'newPassword',
              t('auth.newPassword'),
              showNew,
              () => setShowNew((s) => !s),
            )}
            {PasswordField(
              'confirmPassword',
              t('auth.confirmPassword'),
              showNew,
              () => setShowNew((s) => !s),
            )}
          </Box>
        )}
      </DialogContent>

      {!isSuccess && (
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={isLoading} color="inherit">
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            form="change-password-form"
            variant="contained"
            disabled={
              isLoading ||
              !form.currentPassword ||
              !form.newPassword ||
              !form.confirmPassword
            }
            startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {t('auth.changePassword')}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}
