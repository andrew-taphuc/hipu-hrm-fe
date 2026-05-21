import { Typography, Box, Card, CardContent } from '@mui/material'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined'
import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'


interface StatCard {
  label: string
  value: string | number
  icon: ReactNode
  color: string
}

const STAT_CARDS: StatCard[] = [
  {
    label: 'nav.employees',
    value: 0,
    icon: <PeopleOutlineIcon />,
    color: '#6366f1',
  },
  {
    label: 'nav.departments',
    value: 0,
    icon: <AccountTreeOutlinedIcon />,
    color: '#8b5cf6',
  },
  {
    label: 'nav.payroll',
    value: 0,
    icon: <PaymentsOutlinedIcon />,
    color: '#0ea5e9',
  },
  {
    label: 'nav.leave',
    value: 0,
    icon: <EventNoteOutlinedIcon />,
    color: '#f59e0b',
  },
]

export default function DashboardPage() {
  const { t } = useTranslation()

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={0.5}>
        {t('nav.dashboard')}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Chào mừng trở lại
      </Typography>

      {/* Stat cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            lg: '1fr 1fr 1fr 1fr',
          },
          gap: 2.5,
          mb: 4,
        }}
      >
        {STAT_CARDS.map((card) => (
          <Card key={card.label} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 1.5,
                }}
              >
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {t(card.label)}
                </Typography>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    bgcolor: `${card.color}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: card.color,
                  }}
                >
                  {card.icon}
                </Box>
              </Box>
              <Typography variant="h4" fontWeight={700}>
                {card.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  )
}
