import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Box,
  Typography,
  IconButton,
  Pagination,
  Skeleton,
  Chip,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { employeeService } from '../services/employee.service'
import { formatCurrency, formatDate, SALARY_TYPE_LABEL } from '../constants'
import type { SalaryHistoryItem } from '../types'

const LIMIT = 8

interface Props {
  open: boolean
  employeeId: number
  employeeName: string
  onClose: () => void
}

export default function SalaryHistoryModal({ open, employeeId, employeeName, onClose }: Props) {
  const [items, setItems] = useState<SalaryHistoryItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!open || !employeeId) return

    let cancelled = false
    setIsLoading(true)

    employeeService
      .getSalaryHistory(employeeId, { page, limit: LIMIT })
      .then((result) => {
        if (cancelled) return
        setItems(result.items)
        setTotal(result.total)
        setTotalPages(result.totalPages)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [open, employeeId, page])

  const handleClose = () => {
    setPage(1)
    setItems([])
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pr: 6 }}>
        Lịch sử lương — <span style={{ fontWeight: 400 }}>{employeeName}</span>
        <IconButton onClick={handleClose} size="small" sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                {['Mức lương', 'Hình thức', 'Hiệu lực từ', 'Hiệu lực đến', 'Ghi chú', 'Ngày tạo'].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 600, py: 1.5, whiteSpace: 'nowrap' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                Array.from({ length: LIMIT }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}><Skeleton /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">Chưa có lịch sử lương</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{formatCurrency(item.baseSalary)}</TableCell>
                    <TableCell>
                      {item.salaryType ? (
                        <Chip label={SALARY_TYPE_LABEL[item.salaryType]} size="small" />
                      ) : '—'}
                    </TableCell>
                    <TableCell>{formatDate(item.effectiveFrom)}</TableCell>
                    <TableCell>{formatDate(item.effectiveTo)}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.note ?? '—'}
                    </TableCell>
                    <TableCell>{formatDate(item.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary">
            Tổng: <strong>{total}</strong> bản ghi
          </Typography>
          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, p) => setPage(p)}
              size="small"
              shape="rounded"
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  )
}
