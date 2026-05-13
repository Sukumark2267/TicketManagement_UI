import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack,
  Typography
} from '@mui/material';

import PageLoader from '../../components/PageLoader';
import { api } from '../../services/api';

const CustomerDetailsPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [customerUsers, setCustomerUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        const [customerResponse, usersResponse] = await Promise.all([
          api.customers.byId(id),
          api.users.customers({ customerId: Number(id), pageNumber: 1, pageSize: 100 })
        ]);
        setCustomer(customerResponse);
        setCustomerUsers(usersResponse.items ?? []);
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
        <Stack direction="row" spacing={1.25}>
          <Button component={Link} to={`/users/customers/${customer.id}/logins/create`} variant="outlined">Add Login</Button>
          <Button component={Link} to={`/users/customers/${customer.id}/edit`} variant="contained">Edit Customer</Button>
        </Stack>
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

      <Card className="glass-panel">
        <CardContent>
          <Typography variant="h6" gutterBottom>Customer Logins</Typography>
          {customerUsers.length ? (
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 720 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customerUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.firstName} {user.lastName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.isActive ? 'Active' : 'Inactive'}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Button component={Link} to={`/users/customers/${customer.id}/logins/${user.id}`}>View</Button>
                          <Button component={Link} to={`/users/customers/${customer.id}/logins/${user.id}/edit`}>Edit</Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          ) : (
            <Typography color="text.secondary">No customer logins added yet.</Typography>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
};

export default CustomerDetailsPage;
