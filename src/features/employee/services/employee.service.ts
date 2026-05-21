import { employeeApi } from '../api/employee.api'
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

interface Paginated<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Service layer — gọi employeeApi và trả về phần data.
 * Slice / component chỉ tương tác qua layer này.
 */
export const employeeService = {
  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const { data } = await employeeApi.create(dto)
    return data.data
  },

  async getAll(params?: EmployeeQueryParams): Promise<Paginated<EmployeeListItem>> {
    const { data } = await employeeApi.getAll(params)
    return data.data
  },

  async getMe(): Promise<Employee> {
    const { data } = await employeeApi.getMe()
    return data.data
  },

  async updateMe(dto: UpdateMyProfileDto): Promise<Employee> {
    const { data } = await employeeApi.updateMe(dto)
    return data.data
  },

  async getById(id: number): Promise<Employee> {
    const { data } = await employeeApi.getById(id)
    return data.data
  },

  async updateById(id: number, dto: UpdateEmployeeDto): Promise<Employee> {
    const { data } = await employeeApi.updateById(id, dto)
    return data.data
  },

  async activate(id: number): Promise<Employee> {
    const { data } = await employeeApi.activate(id)
    return data.data
  },

  async deactivate(id: number): Promise<Employee> {
    const { data } = await employeeApi.deactivate(id)
    return data.data
  },

  async updateSalary(
    id: number,
    dto: UpdateSalaryDto,
  ): Promise<Pick<Employee, 'id' | 'baseSalary' | 'salaryType'>> {
    const { data } = await employeeApi.updateSalary(id, dto)
    return data.data
  },

  async getSalaryHistory(
    id: number,
    params?: Pick<EmployeeQueryParams, 'page' | 'limit'>,
  ): Promise<Paginated<SalaryHistoryItem>> {
    const { data } = await employeeApi.getSalaryHistory(id, params)
    return data.data
  },
}
