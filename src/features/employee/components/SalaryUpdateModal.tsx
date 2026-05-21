import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress,
  Typography,
  IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { employeeService } from '../services/employee.service'

interface Props {
  open: boolean
  employeeId: number
  employeeName: string
  onClose: () => void
  onSuccess: () => void
}

export default function SalaryUpdateModal({ open, employeeId, employeeName, onClose, onSuccess }: Props) {
  const [baseSalary, setBaseSalary] = useState('')
  const [note, setNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    if (isLoading) return
    setBaseSalary('')
    setNote('')
    setError(null)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!baseSalary) return
    setIsLoading(true)
    setError(null)
    try {
      await employeeService.updateSalary(employeeId, {
        baseSalary: parseFloat(baseSalary),
        ...(note ? { note } : {}),
      })
      handleClose()
      onSuccess()
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setError(e.response?.data?.message ?? 'Cập nhật lương thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ pr: 6 }}>
        Cập nhật lương
        <IconButton onClick={handleClose} disabled={isLoading} size="small" sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Nhân viên: <strong>{employeeName}</strong>
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" id="salary-form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Lương cơ bản mới (VNĐ)"
            type="number"
            value={baseSalary}
            onChange={(e) => setBaseSalary(e.target.value)}
            required
            disabled={isLoading}
            margin="dense"
            slotProps={{ htmlInput: { min: 0 } }}
          />
          <TextField
            fullWidth
            label="Ghi chú (tuỳ chọn)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            multiline
            rows={3}
            disabled={isLoading}
            margin="dense"
            placeholder="VD: Tăng lương do thăng chức..."
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={isLoading} color="inherit">Huỷ</Button>
        <Button
          type="submit"
          form="salary-form"
          variant="contained"
          disabled={isLoading || !baseSalary}
          startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  )
}
