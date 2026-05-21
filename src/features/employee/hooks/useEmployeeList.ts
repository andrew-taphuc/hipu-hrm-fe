import { useState, useEffect } from 'react'
import { employeeService } from '../services/employee.service'
import type { EmployeeListItem, EmployeeQueryParams } from '../types'

const LIMIT = 10

export function useEmployeeList() {
  const [employees, setEmployees] = useState<EmployeeListItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearchRaw] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  // Debounce search — reset to page 1 after delay
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(t)
  }, [search])

  // Fetch
  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    const params: EmployeeQueryParams = { page, limit: LIMIT }
    if (debouncedSearch) params.search = debouncedSearch

    employeeService
      .getAll(params)
      .then((result) => {
        if (cancelled) return
        setEmployees(result.items)
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
  }, [page, debouncedSearch, refreshKey])

  const setSearch = (v: string) => setSearchRaw(v)
  const refresh = () => setRefreshKey((k) => k + 1)

  return { employees, total, page, totalPages, isLoading, search, setSearch, setPage, refresh }
}
