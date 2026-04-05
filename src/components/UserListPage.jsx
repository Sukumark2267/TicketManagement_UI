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
  Typography
} from '@mui/material';

import AdminActionStrip from './AdminActionStrip';

const UserListPage = ({ title, subtitle, createTo, createLabel, loadUsers, toggleStatus }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [query, setQuery] = useState({ pageNumber: 1, pageSize: 10 });
  const [pagination, setPagination] = useState({ totalCount: 0, pageNumber: 1, pageSize: 10 });

  const load = async (currentQuery = query) => {
    try {
      setError('');
      const response = await loadUsers(currentQuery);
      setUsers(response.items);
      setPagination({
        totalCount: response.totalCount ?? response.items.length,
        pageNumber: response.pageNumber ?? currentQuery.pageNumber,
        pageSize: response.pageSize ?? currentQuery.pageSize
      });
    } catch (loadError) {
      setError(loadError.response?.data?.detail ?? 'Unable to load users.');
    }
  };

  useEffect(() => {
    void load();
  }, [query.pageNumber, query.pageSize]);

  return (
    <Stack spacing={3}>
      <Box className="page-header">
        <Box>
          <Typography className="page-title">{title}</Typography>
          <Typography className="page-subtitle">{subtitle}</Typography>
        </Box>
        <Button component={Link} to={createTo} variant="contained">{createLabel}</Button>
      </Box>

      {title === 'Technician List' ? <AdminActionStrip /> : null}

      {error && <Alert severity="error">{error}</Alert>}

      <Card className="glass-panel">
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.firstName} {user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.isActive ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell align="right">
                    <Button onClick={async () => {
                      try {
                        setError('');
                        await toggleStatus(user);
                        await load();
                      } catch (toggleError) {
                        setError(toggleError.response?.data?.detail ?? 'Unable to update user status.');
                      }
                    }}>
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={pagination.totalCount}
            page={Math.max(pagination.pageNumber - 1, 0)}
            onPageChange={(_, page) => setQuery((current) => ({ ...current, pageNumber: page + 1 }))}
            rowsPerPage={pagination.pageSize}
            onRowsPerPageChange={(event) =>
              setQuery({
                pageNumber: 1,
                pageSize: Number(event.target.value)
              })
            }
            rowsPerPageOptions={[5, 10, 20, 50]}
          />
        </CardContent>
      </Card>
    </Stack>
  );
};

export default UserListPage;
