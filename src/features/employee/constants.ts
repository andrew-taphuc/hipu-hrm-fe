import type { Gender, EmploymentType, SalaryType } from './types'

// ─── Select options ───────────────────────────────────────────────────────────

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'MALE', label: 'Nam' },
  { value: 'FEMALE', label: 'Nữ' },
  { value: 'OTHER', label: 'Khác' },
]

export const EMPLOYMENT_TYPE_OPTIONS: { value: EmploymentType; label: string }[] = [
  { value: 'FULLTIME', label: 'Toàn thời gian' },
  { value: 'PARTTIME', label: 'Bán thời gian' },
  { value: 'CONTRACT', label: 'Hợp đồng' },
]

export const SALARY_TYPE_OPTIONS: { value: SalaryType; label: string }[] = [
  { value: 'MONTHLY', label: 'Theo tháng' },
  { value: 'HOURLY', label: 'Theo giờ' },
  { value: 'DAILY', label: 'Theo ngày' },
]

// ─── Label maps ───────────────────────────────────────────────────────────────

export const GENDER_LABEL: Record<string, string> = {
  MALE: 'Nam',
  FEMALE: 'Nữ',
  OTHER: 'Khác',
}

export const EMPLOYMENT_TYPE_LABEL: Record<string, string> = {
  FULLTIME: 'Toàn thời gian',
  PARTTIME: 'Bán thời gian',
  CONTRACT: 'Hợp đồng',
}

export const SALARY_TYPE_LABEL: Record<string, string> = {
  MONTHLY: 'Theo tháng',
  HOURLY: 'Theo giờ',
  DAILY: 'Theo ngày',
}

// ─── Formatters ───────────────────────────────────────────────────────────────

export const formatCurrency = (amount: number | string | null | undefined): string => {
  if (amount === null || amount === undefined || amount === '') return '—'
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(num)) return '—'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num)
}

export const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN')
  } catch {
    return '—'
  }
}

/** Convert ISO datetime string → "YYYY-MM-DD" for <input type="date"> */
export const toDateInputValue = (dateStr: string | null | undefined): string =>
  dateStr ? dateStr.split('T')[0] : ''
