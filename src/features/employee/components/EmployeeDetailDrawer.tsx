import { useState, useEffect } from 'react'
import {
  Drawer,
  Box,
  Typography,
  Divider,
  IconButton,
  Button,
  Skeleton,
  Chip,
  Stack,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { employeeService } from '../services/employee.service'
import {
  GENDER_LABEL,
  EMPLOYMENT_TYPE_LABEL,
  SALARY_TYPE_LABEL,
  formatCurrency,
  formatDate,
} from '../constants'
import EmployeeStatusChip from './EmployeeStatusChip'
import type { Employee } from '../types'

const DRAWER_WIDTH = 500

// ─── Detail row ───────────────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 1, py: 0.75 }}>
      <Typography variant="body2" color="text.secondary" noWrap>{label}</Typography>
      <Typography variant="body2" fontWeight={500}>{value ?? '—'}</Typography>
    </Box>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Box mt={2.5} mb={1}>
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
  employeeId: number
  onClose: () => void
  onEdit: () => void
}

export default function EmployeeDetailDrawer({ open, employeeId, onClose, onEdit }: Props) {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!open || !employeeId) return
    setIsLoading(true)
    employeeService
      .getById(employeeId)
      .then(setEmployee)
      .catch(() => setEmployee(null))
      .finally(() => setIsLoading(false))
  }, [open, employeeId])

  useEffect(() => {
    if (!open) setEmployee(null)
  }, [open])

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: DRAWER_WIDTH } } }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight={700} flex={1}>
          Hồ sơ nhân viên
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<EditOutlinedIcon />}
          onClick={onEdit}
          sx={{ mr: 1 }}
        >
          Chỉnh sửa
        </Button>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ px: 3, py: 2, overflowY: 'auto', flex: 1 }}>
        {isLoading || !employee ? (
          <Box>
            {Array.from({ length: 12 }).map((_, i) => (
              <Box key={i} sx={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 1, py: 0.75 }}>
                <Skeleton width={100} />
                <Skeleton width="80%" />
              </Box>
            ))}
          </Box>
        ) : (
          <>
            {/* Avatar / name banner */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Box
                sx={{
                  width: 52, height: 52, borderRadius: '50%', bgcolor: 'primary.main',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: 20, flexShrink: 0,
                }}
              >
                {employee.user.fullName.charAt(0).toUpperCase()}
              </Box>
              <Box flex={1} minWidth={0}>
                <Typography fontWeight={700} noWrap>{employee.user.fullName}</Typography>
                <Typography variant="body2" color="text.secondary" noWrap>{employee.user.email}</Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip label={employee.employeeCode} size="small" variant="outlined" />
                <EmployeeStatusChip status={employee.status} />
              </Stack>
            </Box>

            {/* Thông tin cá nhân */}
            <SectionTitle>Thông tin cá nhân</SectionTitle>
            <DetailRow label="Số điện thoại" value={employee.phone} />
            <DetailRow label="Giới tính" value={employee.gender ? GENDER_LABEL[employee.gender] : null} />
            <DetailRow label="Ngày sinh" value={formatDate(employee.dateOfBirth)} />
            <DetailRow label="Địa chỉ" value={employee.address} />
            <DetailRow label="Số CCCD/CMND" value={employee.idCardNumber} />

            {/* Thông tin công việc */}
            <SectionTitle>Thông tin công việc</SectionTitle>
            <DetailRow label="Ngày vào làm" value={formatDate(employee.joinDate)} />
            <DetailRow
              label="Loại hợp đồng"
              value={employee.employmentType ? EMPLOYMENT_TYPE_LABEL[employee.employmentType] : null}
            />

            {/* Lương & tài chính */}
            <SectionTitle>Lương & Tài chính</SectionTitle>
            <DetailRow label="Lương cơ bản" value={formatCurrency(employee.baseSalary)} />
            <DetailRow
              label="Hình thức lương"
              value={employee.salaryType ? SALARY_TYPE_LABEL[employee.salaryType] : null}
            />
            <DetailRow label="Mã số thuế" value={employee.taxCode} />
            <DetailRow label="Số tài khoản" value={employee.bankAccount} />
            <DetailRow label="Ngân hàng" value={employee.bankName} />
          </>
        )}
      </Box>
    </Drawer>
  )
}
