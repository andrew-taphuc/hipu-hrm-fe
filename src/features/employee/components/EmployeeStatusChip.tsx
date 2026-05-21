import { Chip } from '@mui/material'
import type { EmployeeStatus } from '../types'

const CONFIG: Record<EmployeeStatus, { label: string; color: 'success' | 'default' }> = {
  active: { label: 'Đang làm việc', color: 'success' },
  deactivated: { label: 'Đã khoá', color: 'default' },
}

export default function EmployeeStatusChip({ status }: { status: EmployeeStatus }) {
  const cfg = CONFIG[status] ?? CONFIG.deactivated
  return <Chip label={cfg.label} color={cfg.color} size="small" variant="outlined" />
}
