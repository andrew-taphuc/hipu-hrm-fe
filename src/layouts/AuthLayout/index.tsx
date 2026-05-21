import { Box, Paper, Typography } from '@mui/material'
import { Outlet } from 'react-router'
import appConfig from '@/config/app.config'

export default function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f0f0ff',
        backgroundImage:
          'radial-gradient(ellipse at 60% 20%, rgba(99,102,241,0.12) 0%, transparent 60%)',
        p: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 440 }}>
        <Typography
          variant="h5"
          fontWeight={800}
          color="primary"
          textAlign="center"
          mb={3}
          sx={{ letterSpacing: '-0.5px' }}
        >
          {appConfig.appName}
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Outlet />
        </Paper>
      </Box>
    </Box>
  )
}
