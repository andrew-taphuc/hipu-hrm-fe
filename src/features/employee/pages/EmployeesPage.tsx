import { useState } from 'react'
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useEmployeeList } from '../hooks/useEmployeeList'
import { employeeService } from '../services/employee.service'
import EmployeeToolbar from '../components/EmployeeToolbar'
import EmployeeTable from '../components/EmployeeTable'
import EmployeeFormModal from '../components/EmployeeFormModal'
import EmployeeDetailDrawer from '../components/EmployeeDetailDrawer'
// import SalaryUpdateModal from '../components/SalaryUpdateModal'   // TODO: bật lại khi có API lương
// import SalaryHistoryModal from '../components/SalaryHistoryModal'  // TODO: bật lại khi có API lương
import type { EmployeeListItem } from '../types'

interface SnackbarState {
  open: boolean
  message: string
  severity: 'success' | 'error'
}

export default function EmployeesPage() {
  const { employees, isLoading, total, page, totalPages, search, setSearch, setPage, refresh } =
    useEmployeeList()

  // ─── Modal states ──────────────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [detailId, setDetailId] = useState<number | null>(null)
  // const [salaryTarget, setSalaryTarget] = useState<EmployeeListItem | null>(null)  // TODO: bật lại khi có API lương
  // const [historyTarget, setHistoryTarget] = useState<EmployeeListItem | null>(null)  // TODO: bật lại khi có API lương
  const [toggleTarget, setToggleTarget] = useState<EmployeeListItem | null>(null)
  const [toggleLoading, setToggleLoading] = useState(false)

  // ─── Snackbar ──────────────────────────────────────────────────────────────
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  })

  const showSnackbar = (message: string, severity: SnackbarState['severity'] = 'success') =>
    setSnackbar({ open: true, message, severity })

  const closeSnackbar = () => setSnackbar((s) => ({ ...s, open: false }))

  // ─── Table event handlers ──────────────────────────────────────────────────
  const handleView = (id: number) => setDetailId(id)
  const handleEdit = (id: number) => setEditId(id)
  // const handleSalary = (emp: EmployeeListItem) => setSalaryTarget(emp)  // TODO: bật lại khi có API lương
  // const handleHistory = (emp: EmployeeListItem) => setHistoryTarget(emp)  // TODO: bật lại khi có API lương
  const handleToggleStatus = (emp: EmployeeListItem) => setToggleTarget(emp)

  // ─── Confirm toggle ────────────────────────────────────────────────────────
  const handleConfirmToggle = async () => {
    if (!toggleTarget) return
    setToggleLoading(true)
    try {
      if (toggleTarget.status === 'active') {
        await employeeService.deactivate(toggleTarget.id)
        showSnackbar(`Đã khoá tài khoản ${toggleTarget.user.fullName}`)
      } else {
        await employeeService.activate(toggleTarget.id)
        showSnackbar(`Đã mở khoá tài khoản ${toggleTarget.user.fullName}`)
      }
      refresh()
    } catch {
      showSnackbar('Thao tác thất bại, vui lòng thử lại', 'error')
    } finally {
      setToggleLoading(false)
      setToggleTarget(null)
    }
  }

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Quản lý nhân viên</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Tổng cộng {total} nhân viên trong hệ thống
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
        >
          Thêm nhân viên
        </Button>
      </Box>

      {/* Toolbar (search) */}
      <EmployeeToolbar search={search} onSearchChange={setSearch} />

      {/* Table */}
      <EmployeeTable
        employees={employees}
        isLoading={isLoading}
        total={total}
        page={page}
        totalPages={totalPages}
        onView={handleView}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        onPageChange={setPage}
      />

      {/* ─ Create modal ─ */}
      <EmployeeFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => {
          setCreateOpen(false)
          refresh()
          showSnackbar('Tạo nhân viên thành công!')
        }}
      />

      {/* ─ Edit modal ─ */}
      <EmployeeFormModal
        open={editId !== null}
        employeeId={editId ?? undefined}
        onClose={() => setEditId(null)}
        onSuccess={() => {
          setEditId(null)
          refresh()
          showSnackbar('Cập nhật thông tin thành công!')
        }}
      />

      {/* ─ Detail drawer ─ */}
      <EmployeeDetailDrawer
        open={detailId !== null}
        employeeId={detailId ?? 0}
        onClose={() => setDetailId(null)}
        onEdit={() => {
          const id = detailId
          setDetailId(null)
          setEditId(id)
        }}
      />

      {/* TODO: bật lại khi có API lương
      <SalaryUpdateModal
        open={salaryTarget !== null}
        employeeId={salaryTarget?.id ?? 0}
        employeeName={salaryTarget?.user.fullName ?? ''}
        onClose={() => setSalaryTarget(null)}
        onSuccess={() => {
          setSalaryTarget(null)
          refresh()
          showSnackbar('Cập nhật lương thành công!')
        }}
      />
      <SalaryHistoryModal
        open={historyTarget !== null}
        employeeId={historyTarget?.id ?? 0}
        employeeName={historyTarget?.user.fullName ?? ''}
        onClose={() => setHistoryTarget(null)}
      />
      */}

      {/* ─ Confirm activate / deactivate ─ */}
      <Dialog
        open={toggleTarget !== null}
        onClose={() => !toggleLoading && setToggleTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Xác nhận thay đổi trạng thái</DialogTitle>
        <DialogContent>
          <Typography>
            {toggleTarget?.status === 'active' ? (
              <>
                Bạn có chắc muốn <strong>khoá tài khoản</strong> của{' '}
                <strong>{toggleTarget?.user.fullName}</strong> không?
              </>
            ) : (
              <>
                Bạn có chắc muốn <strong>mở khoá tài khoản</strong> của{' '}
                <strong>{toggleTarget?.user.fullName}</strong> không?
              </>
            )}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setToggleTarget(null)} disabled={toggleLoading} color="inherit">
            Huỷ
          </Button>
          <Button
            onClick={handleConfirmToggle}
            variant="contained"
            color={toggleTarget?.status === 'active' ? 'error' : 'success'}
            disabled={toggleLoading}
            startIcon={toggleLoading ? <CircularProgress size={14} color="inherit" /> : null}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─ Snackbar ─ */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={closeSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
