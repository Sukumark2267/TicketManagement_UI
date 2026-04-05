import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography
} from '@mui/material';

import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (auth.isAuthenticated) {
    return <Navigate to={auth.dashboardPath} replace />;
  }

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError('');

      const response = await auth.login(form);

      const nextPath =
        response.user.role === 'Admin'
          ? '/dashboard/admin'
          : response.user.role === 'Technician'
            ? '/dashboard/technician'
            : '/dashboard/customer';

      navigate(nextPath, { replace: true });
    } catch (loginError) {
      setError(loginError.response?.data?.detail ?? 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3 }}>
      <Card className="glass-panel" sx={{ width: 'min(1040px, 100%)', p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <Box
              sx={{
                height: '100%',
                p: 4,
                borderRadius: 4,
                color: '#fff',
                background: 'linear-gradient(155deg, rgba(20,91,130,0.98), rgba(47,137,184,0.92))'
              }}
            >
              <Box
                component="img"
                src="/images/supernal_logo.png"
                alt="Supernal Technologies"
                sx={{
                  width: 'min(100%, 360px)',
                  height: 'auto',
                  display: 'block',
                  mb: 3,
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  borderRadius: 3,
                  px: 1.5,
                  py: 1
                }}
              />
              <Typography variant="overline">Production-Style Ticket Platform</Typography>
              <Typography variant="h3" sx={{ mt: 1, mb: 2, fontWeight: 700 }}>
                Welcome back
              </Typography>
              <Typography sx={{ lineHeight: 1.8 }}>
                Sign in to manage tickets, customers, technicians, dashboards
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            <CardContent component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
              <Stack spacing={2}>
                <Typography variant="h4" fontWeight={700}>
                  Login
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}

                <TextField
                  label="Username or Email"
                  value={form.usernameOrEmail}
                  onChange={handleChange('usernameOrEmail')}
                  fullWidth
                  required
                />

                <TextField
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={handleChange('password')}
                  fullWidth
                  required
                />

                <Button type="submit" variant="contained" size="large" disabled={submitting}>
                  Sign In
                </Button>
              </Stack>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default LoginPage;
