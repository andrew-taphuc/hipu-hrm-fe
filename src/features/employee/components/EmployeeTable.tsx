import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Skeleton,
  Box,
  Typography,
  Pagination,
  IconButton,
  Tooltip,
  Stack,
  Chip,
} from '@mui/material'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
// import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined' // TODO: bật lại khi có API lương
// import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'          // TODO: bật lại khi có API lương
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'
import type { EmployeeListItem } from '../types'
import EmployeeStatusChip from './EmployeeStatusChip'

const ROLE_LABEL: Record<string, string> = {
  ADMIN: 'Admin',
  HR: 'HR',
  MANAGER: 'Quản lý',
  EMPLOYEE: 'Nhân viên',
}

const COLUMNS = [
  { label: 'Mã NV', width: 100 },
  { label: 'Họ tên', width: 200 },
  { label: 'Email', width: 220 },
  { label: 'Vai trò', width: 200 },
  { label: 'Trạng thái', width: 140 },
  { label: 'Thao tác', width: 160, align: 'center' as const },
]

interface Props {
  employees: EmployeeListItem[]
  isLoading: boolean
  total: number
  page: number
  totalPages: number
  onView: (id: number) => void
  onEdit: (id: number) => void
  // onSalary: (employee: EmployeeListItem) => void  // TODO: bật lại khi có API lương
  // onHistory: (employee: EmployeeListItem) => void // TODO: bật lại khi có API lương
  onToggleStatus: (employee: EmployeeListItem) => void
  onPageChange: (page: number) => void
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <TableRow key={i}>
          {COLUMNS.map((col) => (
            <TableCell key={col.label}>
              <Skeleton animation="wave" height={24} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

export default function EmployeeTable({
  employees,
  isLoading,
  total,
  page,
  totalPages,
  onView,
  onEdit,
  // onSalary,   // TODO: bật lại khi có API lương
  // onHistory,  // TODO: bật lại khi có API lương
  onToggleStatus,
  onPageChange,
}: Props) {
  return (
    <Box>
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small" sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              {COLUMNS.map((col) => (
                <TableCell
                  key={col.label}
                  width={col.width}
                  align={col.align}
                  sx={{ fontWeight: 600, py: 1.5, whiteSpace: 'nowrap' }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              <SkeletonRows />
            ) : employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={COLUMNS.length} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">Không có dữ liệu</Typography>
                </TableCell>
              </TableRow>
            ) : (
              employees.map((emp) => (
                <TableRow key={emp.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{emp.employeeCode}</TableCell>
                  <TableCell>{emp.user.fullName}</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{emp.user.email}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      {emp.roles.map((role) => (
                        <Chip key={role} label={ROLE_LABEL[role] ?? role} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <EmployeeStatusChip status={emp.status} />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <Tooltip title="Xem chi tiết">
                        <IconButton size="small" onClick={() => onView(emp.id)}>
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton size="small" onClick={() => onEdit(emp.id)}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {/* TODO: bật lại khi có API lương
                      <Tooltip title="Cập nhật lương">
                        <IconButton size="small" color="primary" onClick={() => onSalary(emp)}>
                          <AttachMoneyOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Lịch sử lương">
                        <IconButton size="small" onClick={() => onHistory(emp)}>
                          <HistoryOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      */}
                      <Tooltip title={emp.status === 'active' ? 'Khoá tài khoản' : 'Mở khoá'}>
                        <IconButton
                          size="small"
                          color={emp.status === 'active' ? 'error' : 'success'}
                          onClick={() => onToggleStatus(emp)}
                        >
                          {emp.status === 'active' ? (
                            <LockOutlinedIcon fontSize="small" />
                          ) : (
                            <LockOpenOutlinedIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer: total + pagination */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 2,
          px: 0.5,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Tổng: <strong>{total}</strong> nhân viên
        </Typography>
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, p) => onPageChange(p)}
            color="primary"
            size="small"
            shape="rounded"
          />
        )}
      </Box>
    </Box>
  )
}
