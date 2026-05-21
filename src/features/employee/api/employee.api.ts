import axiosInstance from '@/lib/axios'
import type {
  Employee,
  EmployeeListItem,
  SalaryHistoryItem,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  UpdateMyProfileDto,
  UpdateSalaryDto,
  EmployeeQueryParams,
} from '../types'

// Re-use the paginated wrapper shape from the backend
interface Paginated<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface ApiData<T> {
  data: T
}

const PREFIX = '/employees'

/**
 * Raw HTTP layer — chỉ gọi API, không xử lý side effect.
 */
export const employeeApi = {
  // ─── 1. Tạo mới nhân viên ─────────────────────────────────────────────────
  create(dto: CreateEmployeeDto) {
    return axiosInstance.post<ApiData<Employee>>(PREFIX, dto)
  },

  // ─── 2. Danh sách nhân viên (phân trang + tìm kiếm) ──────────────────────
  getAll(params?: EmployeeQueryParams) {
    return axiosInstance.get<ApiData<Paginated<EmployeeListItem>>>(PREFIX, {
      params,
    })
  },

  // ─── 3. Hồ sơ của user đang đăng nhập ─────────────────────────────────────
  getMe() {
    return axiosInstance.get<ApiData<Employee>>(`${PREFIX}/me`)
  },

  // ─── 4. Nhân viên tự cập nhật thông tin cá nhân ───────────────────────────
  updateMe(dto: UpdateMyProfileDto) {
    return axiosInstance.patch<ApiData<Employee>>(`${PREFIX}/me`, dto)
  },

  // ─── 5. Hồ sơ chi tiết theo ID ────────────────────────────────────────────
  getById(id: number) {
    return axiosInstance.get<ApiData<Employee>>(`${PREFIX}/${id}`)
  },

  // ─── 6. Cập nhật nhân viên theo ID (admin/HR) ──────────────────────────────
  updateById(id: number, dto: UpdateEmployeeDto) {
    return axiosInstance.patch<ApiData<Employee>>(`${PREFIX}/${id}`, dto)
  },

  // ─── 7. Mở khoá tài khoản ─────────────────────────────────────────────────
  activate(id: number) {
    return axiosInstance.patch<ApiData<Employee>>(`${PREFIX}/${id}/activate`)
  },

  // ─── 8. Khoá tài khoản ────────────────────────────────────────────────────
  deactivate(id: number) {
    return axiosInstance.patch<ApiData<Employee>>(`${PREFIX}/${id}/deactivate`)
  },

  // ─── 9. Điều chỉnh lương ──────────────────────────────────────────────────
  updateSalary(id: number, dto: UpdateSalaryDto) {
    return axiosInstance.patch<ApiData<Pick<Employee, 'id' | 'baseSalary' | 'salaryType'>>>(
      `${PREFIX}/${id}/salary`,
      dto,
    )
  },

  // ─── 10. Lịch sử biến động lương ─────────────────────────────────────────
  getSalaryHistory(id: number, params?: Pick<EmployeeQueryParams, 'page' | 'limit'>) {
    return axiosInstance.get<ApiData<Paginated<SalaryHistoryItem>>>(
      `${PREFIX}/${id}/salary-history`,
      { params },
    )
  },
}
