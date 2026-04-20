import { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { getApiErrorMessage } from '../../utils/apiErrors';

const ChangePasswordPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      setError('New password and confirm password must match.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const user = await api.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });

      auth.updateUser(user);

      const nextPath =
        user.role === 'Admin'
          ? '/dashboard/admin'
          : user.role === 'Technician'
            ? '/dashboard/technician'
            : '/dashboard/customer';

      navigate(nextPath, { replace: true });
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, 'Unable to change password.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 'calc(100vh - 160px)' }}>
      <Card className="glass-panel" sx={{ width: 'min(560px, 100%)' }}>
        <CardContent component="form" onSubmit={handleSubmit} sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Stack spacing={2.25}>
            <Box>
              <Typography className="page-title">Change Password</Typography>
              <Typography className="page-subtitle">
                {auth.user?.mustChangePassword
                  ? 'This is your first login. Please change your password before continuing.'
                  : 'Update your password to continue securely.'}
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Current Password"
              type="password"
              value={form.currentPassword}
              onChange={handleChange('currentPassword')}
              fullWidth
              required
            />

            <TextField
              label="New Password"
              type="password"
              value={form.newPassword}
              onChange={handleChange('newPassword')}
              fullWidth
              required
            />

            <TextField
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              fullWidth
              required
            />

            <Button type="submit" variant="contained" disabled={submitting}>
              Save Password
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ChangePasswordPage;
