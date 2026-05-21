import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
} from '@mui/material'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined'
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import { useLocation, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { PATHS } from '@/routes/paths'
import appConfig from '@/config/app.config'
import { DRAWER_WIDTH } from './constants'
import type { ReactNode } from 'react'

interface NavItem {
  label: string
  icon: ReactNode
  path: string
  exactMatch?: boolean
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'nav.dashboard',
    icon: <DashboardOutlinedIcon />,
    path: PATHS.DASHBOARD,
    exactMatch: true,
  },
  { label: 'nav.employees', icon: <PeopleOutlineIcon />, path: PATHS.EMPLOYEES },
  {
    label: 'nav.departments',
    icon: <AccountTreeOutlinedIcon />,
    path: PATHS.DEPARTMENTS,
  },
  { label: 'nav.payroll', icon: <PaymentsOutlinedIcon />, path: PATHS.PAYROLL },
  { label: 'nav.leave', icon: <EventNoteOutlinedIcon />, path: PATHS.LEAVE },
  {
    label: 'nav.users',
    icon: <ManageAccountsOutlinedIcon />,
    path: PATHS.USERS,
  },
  { label: 'nav.settings', icon: <SettingsOutlinedIcon />, path: PATHS.SETTINGS },
]

export default function Sidebar() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (item: NavItem) =>
    item.exactMatch
      ? location.pathname === item.path
      : location.pathname.startsWith(item.path)

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          bgcolor: '#1e1b4b',
          color: '#c7d2fe',
          borderRight: 'none',
        },
      }}
    >
      {/* Logo */}
      <Toolbar sx={{ px: 2.5, minHeight: '64px !important' }}>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ color: '#a5b4fc', letterSpacing: '-0.5px' }}
          noWrap
        >
          {appConfig.appName}
        </Typography>
      </Toolbar>

      <Divider sx={{ borderColor: 'rgba(165,180,252,0.15)' }} />

      {/* Navigation */}
      <Box sx={{ overflow: 'auto', flex: 1, py: 1 }}>
        <List disablePadding>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item)
            return (
              <ListItem key={item.path} disablePadding sx={{ px: 1.5, py: 0.25 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={active}
                  sx={{
                    borderRadius: 1.5,
                    color: active ? '#ffffff' : '#94a3b8',
                    bgcolor: active ? 'primary.main' : 'transparent',
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      '&:hover': { bgcolor: 'primary.dark' },
                    },
                    '&:hover': {
                      bgcolor: active
                        ? 'primary.dark'
                        : 'rgba(165,180,252,0.08)',
                      color: '#c7d2fe',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ minWidth: 38, color: 'inherit', fontSize: 20 }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={t(item.label)}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: active ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Box>
    </Drawer>
  )
}
