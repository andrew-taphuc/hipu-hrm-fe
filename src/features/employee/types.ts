import type { PaginationParams } from '@/types'

// ─── Enums ────────────────────────────────────────────────────────────────────

export type Gender = 'MALE' | 'FEMALE' | 'OTHER'
export type EmploymentType = 'FULLTIME' | 'PARTTIME' | 'CONTRACT'
export type SalaryType = 'MONTHLY' | 'HOURLY' | 'DAILY'
export type EmployeeStatus = 'active' | 'deactivated'

// ─── Domain ───────────────────────────────────────────────────────────────────

export interface EmployeeUser {
  id: number
  email: string
  fullName: string
  isActive: boolean
  mustChangePassword: boolean
}

/** Dùng trong danh sách (GET /employees) */
export interface EmployeeListItem {
  id: number
  employeeCode: string
  status: EmployeeStatus
  user: EmployeeUser
  roles: string[]
}

export interface EmployeeDetailUser {
  id: number
  email: string
  fullName: string
  avatarUrl: string | null
  isActive: boolean
  lastLoginAt: string | null
  mustChangePassword: boolean
}

/** Dùng trong chi tiết (GET /employees/:id) */
export interface Employee {
  id: number
  employeeCode: string
  status: EmployeeStatus
  departmentId: number | null
  phone: string | null
  gender: Gender | null
  dateOfBirth: string | null
  address: string | null
  idCardNumber: string | null
  taxCode: string | null
  bankAccount: string | null
  bankName: string | null
  joinDate: string | null
  leaveDate: string | null
  employmentType: EmploymentType | null
  baseSalary: number | null
  salaryType: SalaryType | null
  note: string | null
  user: EmployeeDetailUser
  roles: string[]
}

export interface SalaryHistoryItem {
  id: number
  employeeId: number
  baseSalary: string
  salaryType: SalaryType
  effectiveFrom: string
  effectiveTo: string | null
  createdBy: number
  note: string | null
  createdAt: string
}

// ─── Request payloads ─────────────────────────────────────────────────────────

export interface CreateEmployeeDto {
  email: string
  fullName: string
  employeeCode: string
  departmentId?: number
  phone?: string
  gender?: Gender
  dateOfBirth?: string
  address?: string
  idCardNumber?: string
  taxCode?: string
  bankAccount?: string
  bankName?: string
  joinDate?: string
  employmentType?: EmploymentType
  baseSalary?: number
  salaryType?: SalaryType
}

/** Tất cả các field đều optional, chỉ gửi những gì cần sửa */
export type UpdateEmployeeDto = Partial<
  Omit<CreateEmployeeDto, 'email' | 'employeeCode'> & {
    employeeCode: string
  }
>

/** Nhân viên tự cập nhật thông tin cá nhân */
export interface UpdateMyProfileDto {
  phone?: string
  address?: string
  bankAccount?: string
  bankName?: string
}

export interface UpdateSalaryDto {
  baseSalary: number
  note?: string
}

// ─── Query params ─────────────────────────────────────────────────────────────

export interface EmployeeQueryParams extends PaginationParams {
  departmentId?: number
}
