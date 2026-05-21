import {
  AppBar,
  Toolbar,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Typography,
  Divider,
  ListItemIcon,
} from '@mui/material'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { logout } from '@/features/auth/authSlice'
import { PATHS } from '@/routes/paths'
import { DRAWER_WIDTH } from './constants'

export default function Header() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const handleLogout = async () => {
    handleClose()
    await dispatch(logout())
    navigate(PATHS.LOGIN, { replace: true })
  }

  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : 'User'
  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : 'U'

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        ml: `${DRAWER_WIDTH}px`,
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ minHeight: '64px !important', px: 3 }}>
        <Box sx={{ flexGrow: 1 }} />

        {/* Avatar / user menu */}
        <Tooltip title={displayName}>
          <IconButton onClick={handleOpen} size="small" sx={{ p: 0 }}>
            <Avatar
              src={user?.avatar}
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {initials}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          slotProps={{ paper: { sx: { mt: 1, minWidth: 200 } } }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              {displayName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>

          <Divider />

          <MenuItem
            onClick={() => {
              handleClose()
              navigate(PATHS.PROFILE)
            }}
          >
            <ListItemIcon>
              <PersonOutlineIcon fontSize="small" />
            </ListItemIcon>
            {t('nav.profile')}
          </MenuItem>

          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <ListItemIcon sx={{ color: 'error.main' }}>
              <LogoutOutlinedIcon fontSize="small" />
            </ListItemIcon>
            {t('auth.logout')}
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
