import { Box, Toolbar } from '@mui/material'
import { Outlet } from 'react-router'
import Sidebar from './Sidebar'
import Header from './Header'
import { DRAWER_WIDTH } from './constants'

export default function AdminLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Header />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          minHeight: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Offset for fixed AppBar */}
        <Toolbar sx={{ minHeight: '64px !important' }} />

        <Box sx={{ flex: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
