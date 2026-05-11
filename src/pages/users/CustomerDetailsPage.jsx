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

const CustomerDetailsPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        setCustomer(await api.customers.byId(id));
      } catch (loadError) {
        setError(loadError.response?.data?.detail ?? 'Unable to load customer details.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  if (loading) {
    return <PageLoader />;
  }

  if (!customer) {
    return <Alert severity="error">{error || 'Unable to load customer.'}</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Box className="page-header">
        <Box>
          <Typography className="page-title">{customer.fullName}</Typography>
          <Typography className="page-subtitle">{customer.email}</Typography>
        </Box>
        <Button component={Link} to={`/users/customers/${customer.id}/edit`} variant="contained">Edit Customer</Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card className="glass-panel">
            <CardContent>
              <Typography variant="h6" gutterBottom>Customer Info</Typography>
              <Typography><strong>Name:</strong> {customer.fullName}</Typography>
              <Typography><strong>Email:</strong> {customer.email}</Typography>
              <Typography><strong>Phone:</strong> {customer.phone}</Typography>
              <Typography><strong>Company:</strong> {customer.companyName || 'NA'}</Typography>
              <Typography><strong>Status:</strong> {customer.isActive ? 'Active' : 'Inactive'}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="glass-panel">
            <CardContent>
              <Typography variant="h6" gutterBottom>Address</Typography>
              <Typography><strong>Address:</strong> {customer.address || 'NA'}</Typography>
              <Typography sx={{ mt: 1 }}><strong>Location:</strong> {customer.location || 'NA'}</Typography>
              <Typography sx={{ mt: 1 }}><strong>Created:</strong> {new Date(customer.createdAt).toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default CustomerDetailsPage;
