import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@mui/material';

import { api } from '../../services/api';
import AdminActionStrip from '../../components/AdminActionStrip';

const CustomerListPage = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');
  const [query, setQuery] = useState({ pageNumber: 1, pageSize: 10, searchTerm: '' });
  const [pagination, setPagination] = useState({ totalCount: 0, pageNumber: 1, pageSize: 10 });

  const load = async (currentQuery = query) => {
    try {
      setError('');
      const response = await api.customers.list(currentQuery);
      setCustomers(response.items);
      setPagination({
        totalCount: response.totalCount ?? response.items.length,
        pageNumber: response.pageNumber ?? currentQuery.pageNumber,
        pageSize: response.pageSize ?? currentQuery.pageSize
      });
    } catch (loadError) {
      setError(loadError.response?.data?.detail ?? 'Unable to load customers.');
    }
  };

  useEffect(() => {
    void load();
  }, [query.pageNumber, query.pageSize, query.searchTerm]);

  return (
    <Stack spacing={3}>
      <Box className="page-header">
        <Box>
          <Typography className="page-title">Customer List</Typography>
          <Typography className="page-subtitle">Review customer profiles that can be selected during ticket creation.</Typography>
        </Box>
        <Button component={Link} to="/users/customers/create" variant="contained">Create Customer</Button>
      </Box>

      <AdminActionStrip />

      {error && <Alert severity="error">{error}</Alert>}

      <Card className="glass-panel">
        <CardContent>
          <TextField
            fullWidth
            label="Search Customers"
            value={query.searchTerm}
            onChange={(event) =>
              setQuery((current) => ({
                ...current,
                pageNumber: 1,
                searchTerm: event.target.value
              }))
            }
            sx={{ mb: 2 }}
          />

          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 760 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.fullName}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.companyName || 'NA'}</TableCell>
                    <TableCell>{customer.isActive ? 'Active' : 'Inactive'}</TableCell>
                    <TableCell align="right">
                      <Button
                        onClick={async () => {
                          try {
                            setError('');
                            await (customer.isActive ? api.customers.deactivate(customer.id) : api.customers.activate(customer.id));
                            await load();
                          } catch (toggleError) {
                            setError(toggleError.response?.data?.detail ?? 'Unable to update customer status.');
                          }
                        }}
                      >
                        {customer.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          <TablePagination
            component="div"
            count={pagination.totalCount}
            page={Math.max(pagination.pageNumber - 1, 0)}
            onPageChange={(_, page) => setQuery((current) => ({ ...current, pageNumber: page + 1 }))}
            rowsPerPage={pagination.pageSize}
            onRowsPerPageChange={(event) =>
              setQuery((current) => ({
                ...current,
                pageNumber: 1,
                pageSize: Number(event.target.value)
              }))
            }
            rowsPerPageOptions={[5, 10, 20, 50]}
          />
        </CardContent>
      </Card>
    </Stack>
  );
};

export default CustomerListPage;
