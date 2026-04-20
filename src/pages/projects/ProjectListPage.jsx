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

import PageLoader from '../../components/PageLoader';
import AdminActionStrip from '../../components/AdminActionStrip';
import { api } from '../../services/api';

const ProjectListPage = () => {
  const [projects, setProjects] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filters, setFilters] = useState({ pageNumber: 1, pageSize: 10, searchTerm: '', customerId: '' });
  const [pagination, setPagination] = useState({ totalCount: 0, pageNumber: 1, pageSize: 10 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await api.customers.list({ pageNumber: 1, pageSize: 200 });
        setCustomers(response.items.filter((item) => item.isActive));
      } catch (loadError) {
        setError(loadError.response?.data?.detail ?? 'Unable to load customers.');
      }
    };

    void loadCustomers();
  }, []);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.projects.list({
          ...filters,
          customerId: filters.customerId || undefined
        });
        setProjects(response.items);
        setPagination({
          totalCount: response.totalCount ?? response.items.length,
          pageNumber: response.pageNumber ?? filters.pageNumber,
          pageSize: response.pageSize ?? filters.pageSize
        });
      } catch (loadError) {
        setError(loadError.response?.data?.detail ?? 'Unable to load projects.');
      } finally {
        setLoading(false);
      }
    };

    void loadProjects();
  }, [filters]);

  const handleFilter = (field) => (event) => {
    setFilters((current) => ({ ...current, pageNumber: 1, [field]: event.target.value }));
  };

  return (
    <Stack spacing={3}>
      <Box className="page-header">
        <Box>
          <Typography className="page-title">Projects Dashboard</Typography>
          <Typography className="page-subtitle">Review customer project and site details across all installation locations.</Typography>
        </Box>
        <Button component={Link} to="/projects/create" variant="contained">Create Project</Button>
      </Box>

      <AdminActionStrip />

      {error && <Alert severity="error">{error}</Alert>}

      <Card className="glass-panel">
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Search Projects" value={filters.searchTerm} onChange={handleFilter('searchTerm')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Customer</InputLabel>
                <Select label="Customer" value={filters.customerId} onChange={handleFilter('customerId')}>
                  <MenuItem value="">All</MenuItem>
                  {customers.map((item) => <MenuItem key={item.id} value={item.id}>{item.fullName}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {loading ? <PageLoader /> : (
        <Card className="glass-panel">
          <CardContent>
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 880 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Project</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Site</TableCell>
                    <TableCell>Site Address</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Created</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>{project.name}</TableCell>
                      <TableCell>{project.customerName}</TableCell>
                      <TableCell>{project.siteName}</TableCell>
                      <TableCell>{project.siteAddress}</TableCell>
                      <TableCell>{project.contactPerson || 'NA'}{project.contactPhone ? ` (${project.contactPhone})` : ''}</TableCell>
                      <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
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
              rowsPerPageOptions={[5, 10, 20, 50]}
            />
          </CardContent>
        </Card>
      )}
    </Stack>
  );
};

export default ProjectListPage;
