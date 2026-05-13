import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography
} from '@mui/material';

import PageLoader from '../../components/PageLoader';
import { api } from '../../services/api';

const CustomerLoginDetailsPage = () => {
  const { customerId, userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        setUser(await api.users.byId(userId));
      } catch (loadError) {
        setError(loadError.response?.data?.detail ?? 'Unable to load customer login.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [userId]);

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Alert severity="error">{error || 'Unable to load customer login.'}</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Box className="page-header">
        <Box>
          <Typography className="page-title">{user.firstName} {user.lastName}</Typography>
          <Typography className="page-subtitle">{user.email}</Typography>
        </Box>
        <Button component={Link} to={`/users/customers/${customerId}/logins/${user.id}/edit`} variant="contained">Edit Login</Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card className="glass-panel">
            <CardContent>
              <Typography variant="h6" gutterBottom>Customer Login Info</Typography>
              <Typography><strong>Name:</strong> {user.firstName} {user.lastName}</Typography>
              <Typography><strong>Email:</strong> {user.email}</Typography>
              <Typography><strong>Phone:</strong> {user.phone}</Typography>
              <Typography><strong>Username:</strong> {user.username}</Typography>
              <Typography><strong>Customer:</strong> {user.customerName || 'NA'}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="glass-panel">
            <CardContent>
              <Typography variant="h6" gutterBottom>Status</Typography>
              <Typography><strong>Status:</strong> {user.isActive ? 'Active' : 'Inactive'}</Typography>
              <Typography sx={{ mt: 1 }}><strong>Created:</strong> {new Date(user.createdAt).toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default CustomerLoginDetailsPage;
