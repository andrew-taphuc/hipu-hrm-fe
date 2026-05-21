import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { employeeService } from '../services/employee.service'
import {
  GENDER_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  SALARY_TYPE_OPTIONS,
  toDateInputValue,
} from '../constants'
import type { CreateEmployeeDto, Gender, EmploymentType, SalaryType } from '../types'

// ─── Form state (all strings for controlled inputs) ───────────────────────────

interface FormState {
  email: string
  fullName: string
  employeeCode: string
  phone: string
  gender: string
  dateOfBirth: string
  address: string
  idCardNumber: string
  taxCode: string
  bankAccount: string
  bankName: string
  joinDate: string
  employmentType: string
  baseSalary: string
  salaryType: string
  departmentId: string
}

const EMPTY_FORM: FormState = {
  email: '', fullName: '', employeeCode: '', phone: '', gender: '',
  dateOfBirth: '', address: '', idCardNumber: '', taxCode: '',
  bankAccount: '', bankName: '', joinDate: '', employmentType: '',
  baseSalary: '', salaryType: '', departmentId: '',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildDto(form: FormState, isEdit: boolean): CreateEmployeeDto | Partial<CreateEmployeeDto> {
  const dto: Record<string, unknown> = {}
  if (!isEdit && form.email) dto.email = form.email
  if (form.fullName) dto.fullName = form.fullName
  if (form.employeeCode) dto.employeeCode = form.employeeCode
  if (form.phone) dto.phone = form.phone
  if (form.gender) dto.gender = form.gender as Gender
  if (form.dateOfBirth) dto.dateOfBirth = new Date(form.dateOfBirth).toISOString()
  if (form.address) dto.address = form.address
  if (form.idCardNumber) dto.idCardNumber = form.idCardNumber
  if (form.taxCode) dto.taxCode = form.taxCode
  if (form.bankAccount) dto.bankAccount = form.bankAccount
  if (form.bankName) dto.bankName = form.bankName
  if (form.joinDate) dto.joinDate = new Date(form.joinDate).toISOString()
  if (form.employmentType) dto.employmentType = form.employmentType as EmploymentType
  if (form.baseSalary) dto.baseSalary = parseFloat(form.baseSalary)
  if (form.salaryType) dto.salaryType = form.salaryType as SalaryType
  if (form.departmentId) dto.departmentId = parseInt(form.departmentId)
  return dto as unknown as CreateEmployeeDto
}

// ─── Section heading ──────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Box mt={2} mb={1.5}>
      <Typography variant="caption" color="primary" fontWeight={700} textTransform="uppercase" letterSpacing={0.5}>
        {children}
      </Typography>
      <Divider sx={{ mt: 0.5 }} />
    </Box>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  open: boolean
  employeeId?: number
  onClose: () => void
  onSuccess: () => void
}

export default function EmployeeFormModal({ open, employeeId, onClose, onSuccess }: Props) {
  const isEdit = !!employeeId
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [isFetching, setIsFetching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset / pre-fill when modal opens
  useEffect(() => {
    if (!open) {
      setForm(EMPTY_FORM)
      setError(null)
      return
    }
    if (!isEdit) return

    setIsFetching(true)
    employeeService
      .getById(employeeId)
      .then((emp) => {
        setForm({
          email: emp.user.email,
          fullName: emp.user.fullName,
          employeeCode: emp.employeeCode,
          phone: emp.phone ?? '',
          gender: emp.gender ?? '',
          dateOfBirth: toDateInputValue(emp.dateOfBirth),
          address: emp.address ?? '',
          idCardNumber: emp.idCardNumber ?? '',
          taxCode: emp.taxCode ?? '',
          bankAccount: emp.bankAccount ?? '',
          bankName: emp.bankName ?? '',
          joinDate: toDateInputValue(emp.joinDate),
          employmentType: emp.employmentType ?? '',
          baseSalary: emp.baseSalary?.toString() ?? '',
          salaryType: emp.salaryType ?? '',
          departmentId: '',
        })
      })
      .catch(() => setError('Không thể tải thông tin nhân viên'))
      .finally(() => setIsFetching(false))
  }, [open, isEdit, employeeId])

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value as string }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      const dto = buildDto(form, isEdit)
      if (isEdit) {
        await employeeService.updateById(employeeId, dto)
      } else {
        await employeeService.create(dto as CreateEmployeeDto)
      }
      onSuccess()
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setError(e.response?.data?.message ?? 'Có lỗi xảy ra')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={isSubmitting ? undefined : onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pr: 6 }}>
        {isEdit ? 'Chỉnh sửa thông tin nhân viên' : 'Thêm nhân viên mới'}
        <IconButton onClick={onClose} disabled={isSubmitting} size="small" sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 2 }}>
        {isFetching ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" id="employee-form" onSubmit={handleSubmit} noValidate>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* ─ Tài khoản ─ */}
            <SectionTitle>Thông tin tài khoản</SectionTitle>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
              <TextField
                label="Email"
                value={form.email}
                onChange={handleChange('email')}
                required={!isEdit}
                disabled={isEdit}
                type="email"
                size="small"
              />
              <TextField
                label="Họ và tên"
                value={form.fullName}
                onChange={handleChange('fullName')}
                required
                size="small"
              />
              <TextField
                label="Mã nhân viên"
                value={form.employeeCode}
                onChange={handleChange('employeeCode')}
                required
                size="small"
              />
            </Box>

            {/* ─ Cá nhân ─ */}
            <SectionTitle>Thông tin cá nhân</SectionTitle>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
              <TextField label="Số điện thoại" value={form.phone} onChange={handleChange('phone')} size="small" />
              <FormControl size="small">
                <InputLabel>Giới tính</InputLabel>
                <Select value={form.gender} label="Giới tính" onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}>
                  <MenuItem value=""><em>— Chọn —</em></MenuItem>
                  {GENDER_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField
                label="Ngày sinh"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange('dateOfBirth')}
                size="small"
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label="Địa chỉ"
                value={form.address}
                onChange={handleChange('address')}
                size="small"
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField label="Số CCCD/CMND" value={form.idCardNumber} onChange={handleChange('idCardNumber')} size="small" />
            </Box>

            {/* ─ Công việc ─ */}
            <SectionTitle>Thông tin công việc</SectionTitle>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
              <TextField
                label="Ngày vào làm"
                type="date"
                value={form.joinDate}
                onChange={handleChange('joinDate')}
                size="small"
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <FormControl size="small">
                <InputLabel>Loại hợp đồng</InputLabel>
                <Select value={form.employmentType} label="Loại hợp đồng" onChange={(e) => setForm((p) => ({ ...p, employmentType: e.target.value }))}>
                  <MenuItem value=""><em>— Chọn —</em></MenuItem>
                  {EMPLOYMENT_TYPE_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField
                label="Phòng ban (ID)"
                type="number"
                value={form.departmentId}
                onChange={handleChange('departmentId')}
                size="small"
                slotProps={{ htmlInput: { min: 1 } }}
              />
            </Box>

            {/* ─ Lương & Tài chính ─ */}
            <SectionTitle>Lương & Tài chính</SectionTitle>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
              <TextField
                label="Lương cơ bản (VNĐ)"
                type="number"
                value={form.baseSalary}
                onChange={handleChange('baseSalary')}
                size="small"
                slotProps={{ htmlInput: { min: 0 } }}
              />
              <FormControl size="small">
                <InputLabel>Hình thức lương</InputLabel>
                <Select value={form.salaryType} label="Hình thức lương" onChange={(e) => setForm((p) => ({ ...p, salaryType: e.target.value }))}>
                  <MenuItem value=""><em>— Chọn —</em></MenuItem>
                  {SALARY_TYPE_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField label="Mã số thuế" value={form.taxCode} onChange={handleChange('taxCode')} size="small" />
              <TextField label="Số tài khoản ngân hàng" value={form.bankAccount} onChange={handleChange('bankAccount')} size="small" />
              <TextField label="Tên ngân hàng" value={form.bankName} onChange={handleChange('bankName')} size="small" />
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting} color="inherit">Huỷ</Button>
        <Button
          type="submit"
          form="employee-form"
          variant="contained"
          disabled={isSubmitting || isFetching}
          startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {isEdit ? 'Lưu thay đổi' : 'Tạo nhân viên'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
