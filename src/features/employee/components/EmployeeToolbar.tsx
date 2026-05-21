import { Box, TextField, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

interface Props {
  search: string
  onSearchChange: (v: string) => void
}

export default function EmployeeToolbar({ search, onSearchChange }: Props) {
  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        size="small"
        placeholder="Tìm theo tên, email, mã nhân viên..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ width: 340 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  )
}
