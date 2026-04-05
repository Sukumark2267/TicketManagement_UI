import { Button, Card, CardContent, Stack } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const actionButtonSx = (active) => ({
  minHeight: 44,
  px: 2.25,
  borderRadius: 2.75,
  textTransform: 'none',
  fontWeight: 700,
  letterSpacing: '0.01em',
  borderColor: 'rgba(20, 91, 130, 0.18)',
  boxShadow: active ? '0 14px 30px rgba(20, 91, 130, 0.18)' : 'none',
  background: active ? 'linear-gradient(180deg, #1d6d99 0%, #145b82 100%)' : 'rgba(255,255,255,0.92)',
  color: active ? '#fff' : '#145b82',
  '&:hover': {
    borderColor: 'rgba(20, 91, 130, 0.26)',
    background: active ? 'linear-gradient(180deg, #165f87 0%, #0f4f74 100%)' : 'rgba(245, 249, 253, 1)',
    boxShadow: active ? '0 18px 34px rgba(20, 91, 130, 0.22)' : '0 10px 22px rgba(16, 35, 58, 0.06)'
  }
});

const matchesPath = (pathname, target) => {
  if (target === '/users/customers') {
    return pathname.startsWith('/users/customers');
  }

  if (target === '/users/technicians') {
    return pathname.startsWith('/users/technicians');
  }

  if (target === '/projects') {
    return pathname.startsWith('/projects');
  }

  if (target === '/tickets/on-behalf') {
    return pathname.startsWith('/tickets/on-behalf');
  }

  return pathname === target;
};

const AdminActionStrip = () => {
  const auth = useAuth();
  const location = useLocation();

  const items = auth.user?.role === 'Admin'
    ? [
        { label: 'View Customers', to: '/users/customers' },
        { label: 'View Technicians', to: '/users/technicians' },
        { label: 'Projects Dashboard', to: '/projects' },
        { label: 'Create Ticket', to: '/tickets/on-behalf' }
      ]
    : [
        { label: 'Projects Dashboard', to: '/projects' },
        { label: 'Create Ticket', to: '/tickets/on-behalf' }
      ];

  return (
    <Card
      className="glass-panel"
      sx={{
        borderRadius: 4,
        border: '1px solid rgba(215, 227, 239, 0.92)',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(251,253,255,0.97))',
        boxShadow: '0 14px 30px rgba(16, 35, 58, 0.05)'
      }}
    >
      <CardContent sx={{ p: { xs: 1.75, md: 2 }, '&:last-child': { pb: { xs: 1.75, md: 2 } } }}>
        <Stack direction="row" spacing={1.25} useFlexGap flexWrap="wrap">
          {items.map((item) => {
            const active = matchesPath(location.pathname, item.to);

            return (
              <Button
                key={item.to}
                component={Link}
                to={item.to}
                variant={active ? 'contained' : 'outlined'}
                sx={actionButtonSx(active)}
              >
                {item.label}
              </Button>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AdminActionStrip;
