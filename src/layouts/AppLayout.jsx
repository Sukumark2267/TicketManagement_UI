import { useMemo } from 'react';
import {
  AppBar,
  Box,
  Button,
  Card,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography
} from '@mui/material';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';

import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import AdminDashboardPage from '../pages/dashboard/AdminDashboardPage';
import CustomerDashboardPage from '../pages/dashboard/CustomerDashboardPage';
import TechnicianDashboardPage from '../pages/dashboard/TechnicianDashboardPage';
import CategoryMasterPage from '../pages/masters/CategoryMasterPage';
import PriorityMasterPage from '../pages/masters/PriorityMasterPage';
import ServiceTypeMasterPage from '../pages/masters/ServiceTypeMasterPage';
import StatusMasterPage from '../pages/masters/StatusMasterPage';
import CreateProjectPage from '../pages/projects/CreateProjectPage';
import ProjectListPage from '../pages/projects/ProjectListPage';
import TicketCreatePage from '../pages/tickets/TicketCreatePage';
import TicketDetailsPage from '../pages/tickets/TicketDetailsPage';
import TicketEditPage from '../pages/tickets/TicketEditPage';
import TicketListPage from '../pages/tickets/TicketListPage';
import TicketOnBehalfPage from '../pages/tickets/TicketOnBehalfPage';
import CreateCustomerPage from '../pages/users/CreateCustomerPage';
import CreateTechnicianPage from '../pages/users/CreateTechnicianPage';
import CustomerListPage from '../pages/users/CustomerListPage';
import TechnicianListPage from '../pages/users/TechnicianListPage';

const drawerWidth = 280;

const headerCardSx = {
  borderRadius: 3.5,
  border: '1px solid rgba(215, 227, 239, 0.9)',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,252,255,0.96))',
  boxShadow: '0 14px 28px rgba(16, 35, 58, 0.06)'
};

const AppLayout = () => {
  const auth = useAuth();
  const location = useLocation();

  const navItems = useMemo(() => {
    const baseItems = [
      { label: 'Ticket List', to: '/tickets' },
      { label: 'My Tickets', to: '/tickets/my' }
    ];

    if (auth.user?.role !== 'Customer') {
      baseItems.push({ label: 'Assigned To Me', to: '/tickets/assigned' });
      baseItems.push({ label: 'Create Ticket', to: '/tickets/on-behalf' });
      baseItems.push({ label: 'Projects', to: '/projects' });
    } else {
      baseItems.push({ label: 'Create Ticket', to: '/tickets/create' });
    }

    if (auth.user?.role === 'Admin') {
      baseItems.unshift({ label: 'Admin Dashboard', to: '/dashboard/admin' });
      baseItems.push(
        { label: 'Customers', to: '/users/customers' },
        { label: 'Technicians', to: '/users/technicians' },
        { label: 'Service Types', to: '/masters/service-types' },
        { label: 'Categories', to: '/masters/categories' },
        { label: 'Priorities', to: '/masters/priorities' },
        { label: 'Statuses', to: '/masters/statuses' }
      );
    } else if (auth.user?.role === 'Technician') {
      baseItems.unshift({ label: 'Technician Dashboard', to: '/dashboard/technician' });
    } else {
      baseItems.unshift({ label: 'Customer Dashboard', to: '/dashboard/customer' });
    }

    return baseItems;
  }, [auth.user]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f6f8fb' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          borderBottom: '1px solid rgba(215, 227, 239, 0.92)',
          backgroundColor: 'rgba(248, 250, 252, 0.88)',
          boxShadow: '0 10px 24px rgba(16, 35, 58, 0.04)',
          backdropFilter: 'blur(16px)'
        }}
      >
        <Toolbar sx={{ minHeight: 84, px: { xs: 2, md: 3.5 }, justifyContent: 'space-between', gap: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0 }}>
            <Box
              component="img"
              src="/images/supernal_logo.png"
              alt="Supernal Technologies"
              sx={{
                height: { xs: 34, md: 42 },
                width: 'auto',
                objectFit: 'contain'
              }}
            />
            <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.04em' }}>
              Ticket Management Portal
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Card className="glass-panel" sx={{ ...headerCardSx, px: 2.2, py: 1.2, minWidth: 184 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em' }}>
                {auth.user?.firstName} {auth.user?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                {auth.user?.role}
              </Typography>
            </Card>
            <Button
              variant="contained"
              onClick={() => void auth.logout()}
              sx={{
                minHeight: 46,
                px: 2.6,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                letterSpacing: '0.01em',
                background: 'linear-gradient(180deg, #1d6d99 0%, #145b82 100%)',
                boxShadow: '0 14px 28px rgba(20, 91, 130, 0.2)',
                '&:hover': {
                  background: 'linear-gradient(180deg, #165f87 0%, #0f4f74 100%)',
                  boxShadow: '0 18px 34px rgba(20, 91, 130, 0.24)'
                }
              }}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #0d1f33 0%, #102843 48%, #143453 100%)',
            color: '#fff',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '18px 0 36px rgba(9, 20, 36, 0.22)',
            p: 2.25
          }
        }}
      >
        <Box
          sx={{
            p: 2.4,
            borderRadius: 4,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.04))',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
            mb: 2.25
          }}
        >
          <Typography variant="overline" sx={{ opacity: 0.72, letterSpacing: '0.16em' }}>
            Monolithic App
          </Typography>
          <Typography sx={{ mt: 1, mb: 1.1, fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Ticket Management
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.7 }}>
            Role-based customer, technician, and admin workflow in a single application.
          </Typography>
        </Box>

        <List sx={{ px: 0.5 }}>
          {navItems.map((item) => (
            <ListItemButton
              key={item.to}
              component={Link}
              to={item.to}
              selected={location.pathname === item.to}
              sx={{
                position: 'relative',
                minHeight: 48,
                px: 2,
                mb: 0.75,
                borderRadius: 3,
                color: 'rgba(255,255,255,0.76)',
                transition: 'background-color 160ms ease, transform 160ms ease, color 160ms ease, box-shadow 160ms ease',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  color: '#ffffff',
                  transform: 'translateX(2px)'
                },
                '&.Mui-selected': {
                  color: '#ffffff',
                  background: 'linear-gradient(90deg, rgba(47, 137, 184, 0.28), rgba(255,255,255,0.08))',
                  border: '1px solid rgba(116, 175, 210, 0.28)',
                  boxShadow: '0 12px 24px rgba(7, 16, 28, 0.2)'
                },
                '&.Mui-selected:hover': {
                  background: 'linear-gradient(90deg, rgba(47, 137, 184, 0.34), rgba(255,255,255,0.1))'
                },
                '&.Mui-selected::before': {
                  content: '""',
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 6,
                  height: 24,
                  borderRadius: 999,
                  background: '#7dd3fc'
                }
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.98rem',
                  fontWeight: location.pathname === item.to ? 700 : 600,
                  letterSpacing: '-0.01em'
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3.5 },
          mt: '84px',
          background:
            'radial-gradient(circle at top left, rgba(47, 137, 184, 0.08), transparent 22%), linear-gradient(180deg, #f8fafc 0%, #f4f7fb 100%)'
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to={auth.dashboardPath} replace />} />
          <Route path="/dashboard/admin" element={<ProtectedRoute roles={['Admin']}><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/dashboard/technician" element={<ProtectedRoute roles={['Technician']}><TechnicianDashboardPage /></ProtectedRoute>} />
          <Route path="/dashboard/customer" element={<ProtectedRoute roles={['Customer']}><CustomerDashboardPage /></ProtectedRoute>} />
          <Route path="/tickets" element={<TicketListPage mode="all" />} />
          <Route path="/tickets/my" element={<TicketListPage mode="my" />} />
          <Route path="/tickets/assigned" element={<ProtectedRoute roles={['Admin', 'Technician']}><TicketListPage mode="assigned" /></ProtectedRoute>} />
          <Route path="/tickets/create" element={<ProtectedRoute roles={['Customer']}><TicketCreatePage /></ProtectedRoute>} />
          <Route path="/tickets/on-behalf" element={<ProtectedRoute roles={['Admin', 'Technician']}><TicketOnBehalfPage /></ProtectedRoute>} />
          <Route path="/tickets/:id" element={<TicketDetailsPage />} />
          <Route path="/tickets/:id/edit" element={<TicketEditPage />} />
          <Route path="/projects" element={<ProtectedRoute roles={['Admin', 'Technician']}><ProjectListPage /></ProtectedRoute>} />
          <Route path="/projects/create" element={<ProtectedRoute roles={['Admin', 'Technician']}><CreateProjectPage /></ProtectedRoute>} />
          <Route path="/users/customers" element={<ProtectedRoute roles={['Admin']}><CustomerListPage /></ProtectedRoute>} />
          <Route path="/users/customers/create" element={<ProtectedRoute roles={['Admin']}><CreateCustomerPage /></ProtectedRoute>} />
          <Route path="/users/technicians" element={<ProtectedRoute roles={['Admin']}><TechnicianListPage /></ProtectedRoute>} />
          <Route path="/users/technicians/create" element={<ProtectedRoute roles={['Admin']}><CreateTechnicianPage /></ProtectedRoute>} />
          <Route path="/masters/service-types" element={<ProtectedRoute roles={['Admin']}><ServiceTypeMasterPage /></ProtectedRoute>} />
          <Route path="/masters/categories" element={<ProtectedRoute roles={['Admin']}><CategoryMasterPage /></ProtectedRoute>} />
          <Route path="/masters/priorities" element={<ProtectedRoute roles={['Admin']}><PriorityMasterPage /></ProtectedRoute>} />
          <Route path="/masters/statuses" element={<ProtectedRoute roles={['Admin']}><StatusMasterPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={auth.dashboardPath} replace />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default AppLayout;
