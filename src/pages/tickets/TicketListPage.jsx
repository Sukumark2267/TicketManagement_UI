import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
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

import { useAuth } from '../../context/AuthContext';
import PageLoader from '../../components/PageLoader';
import { api } from '../../services/api';

const TicketListPage = ({ mode = 'all' }) => {
  const auth = useAuth();
  const [tickets, setTickets] = useState([]);
  const [lookups, setLookups] = useState({ categories: [], priorities: [], statuses: [], customers: [], technicians: [] });
  const [filters, setFilters] = useState({ pageNumber: 1, pageSize: 20 });
  const [pagination, setPagination] = useState({ totalCount: 0, pageNumber: 1, pageSize: 20 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const title = mode === 'my' ? 'My Tickets' : mode === 'assigned' ? 'My Assigned Tickets' : 'Ticket List';

  useEffect(() => {
    const loadLookups = async () => {
      try {
        const [categories, priorities, statuses, customers, technicians] = await Promise.all([
          api.categories.list({ pageNumber: 1, pageSize: 100 }),
          api.priorities.list({ pageNumber: 1, pageSize: 100 }),
          api.statuses.list({ pageNumber: 1, pageSize: 100 }),
          auth.user?.role === 'Customer' ? Promise.resolve({ items: [] }) : api.customers.list({ pageNumber: 1, pageSize: 100 }),
          auth.user?.role === 'Admin' ? api.users.technicians({ pageNumber: 1, pageSize: 100 }) : Promise.resolve({ items: [] })
        ]);

        setLookups({
          categories: categories.items,
          priorities: priorities.items,
          statuses: statuses.items,
          customers: customers.items,
          technicians: technicians.items
        });
      } catch (loadError) {
        setError(loadError.response?.data?.detail ?? 'Unable to load ticket filters.');
      }
    };

    void loadLookups();
  }, [auth.user?.role]);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        setError('');
        const response =
          mode === 'my'
            ? await api.tickets.mine(filters)
            : mode === 'assigned'
              ? await api.tickets.assigned(filters)
              : await api.tickets.list(filters);
        setTickets(response.items);
        setPagination({
          totalCount: response.totalCount ?? response.items.length,
          pageNumber: response.pageNumber ?? filters.pageNumber,
          pageSize: response.pageSize ?? filters.pageSize
        });
      } catch (loadError) {
        setError(loadError.response?.data?.detail ?? 'Unable to load tickets.');
      } finally {
        setLoading(false);
      }
    };

    void loadTickets();
  }, [filters, mode]);

  const handleFilter = (field) => (event) => {
    setFilters((current) => ({ ...current, pageNumber: 1, [field]: event.target.value || undefined }));
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography className="page-title">{title}</Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Card className="glass-panel">
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Search" value={filters.searchTerm ?? ''} onChange={handleFilter('searchTerm')} />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select label="Status" value={filters.statusId ?? ''} onChange={handleFilter('statusId')}>
                  <MenuItem value="">All</MenuItem>
                  {lookups.statuses.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select label="Priority" value={filters.priorityId ?? ''} onChange={handleFilter('priorityId')}>
                  <MenuItem value="">All</MenuItem>
                  {lookups.priorities.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select label="Category" value={filters.categoryId ?? ''} onChange={handleFilter('categoryId')}>
                  <MenuItem value="">All</MenuItem>
                  {lookups.categories.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            {auth.user?.role !== 'Customer' && (
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Customer</InputLabel>
                  <Select label="Customer" value={filters.customerId ?? ''} onChange={handleFilter('customerId')}>
                    <MenuItem value="">All</MenuItem>
                    {lookups.customers.map((item) => <MenuItem key={item.id} value={item.id}>{item.fullName}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            )}
            {auth.user?.role === 'Admin' && (
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Technician</InputLabel>
                  <Select label="Technician" value={filters.technicianId ?? ''} onChange={handleFilter('technicianId')}>
                    <MenuItem value="">All</MenuItem>
                    {lookups.technicians.map((item) => <MenuItem key={item.id} value={item.id}>{item.firstName} {item.lastName}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {loading ? <PageLoader /> : (
      <Card className="glass-panel">
        <CardContent>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Ticket No</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.ticketNumber}</TableCell>
                    <TableCell>{ticket.title}</TableCell>
                    <TableCell>{ticket.customerName || 'NA'}</TableCell>
                    <TableCell>{ticket.projectName || 'NA'}</TableCell>
                    <TableCell>{ticket.serviceTypeName}</TableCell>
                    <TableCell>{ticket.priorityName}</TableCell>
                    <TableCell>{ticket.statusName}</TableCell>
                    <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
                        <Button component={Link} to={`/tickets/${ticket.id}`}>View</Button>
                        <Button component={Link} to={`/tickets/${ticket.id}/edit`}>Edit</Button>
                      </Stack>
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
            onPageChange={(_, page) => setFilters((current) => ({ ...current, pageNumber: page + 1 }))}
            rowsPerPage={pagination.pageSize}
            onRowsPerPageChange={(event) =>
              setFilters((current) => ({
                ...current,
                pageNumber: 1,
                pageSize: Number(event.target.value)
              }))
            }
            rowsPerPageOptions={[10, 20, 50, 100]}
          />
        </CardContent>
      </Card>
      )}
    </Stack>
  );
};

export default TicketListPage;
