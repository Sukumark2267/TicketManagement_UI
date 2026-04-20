import { useEffect, useState } from 'react';
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

const MasterCrudPage = ({ title, subtitle, service, entityName }) => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState({ pageNumber: 1, pageSize: 10 });
  const [pagination, setPagination] = useState({ totalCount: 0, pageNumber: 1, pageSize: 10 });

  const load = async (currentQuery = query) => {
    try {
      setError('');
      const response = await service.list(currentQuery);
      setItems(response.items);
      setPagination({
        totalCount: response.totalCount ?? response.items.length,
        pageNumber: response.pageNumber ?? currentQuery.pageNumber,
        pageSize: response.pageSize ?? currentQuery.pageSize
      });
    } catch (loadError) {
      setError(loadError.response?.data?.detail ?? `Unable to load ${entityName.toLowerCase()} items.`);
    }
  };

  useEffect(() => {
    void load();
  }, [query.pageNumber, query.pageSize]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = { name };

    try {
      setSaving(true);
      setError('');
      if (editingId) {
        await service.update(editingId, payload);
      } else {
        await service.create(payload);
      }

      setName('');
      setEditingId(null);
      await load();
    } catch (saveError) {
      setError(saveError.response?.data?.detail ?? `Unable to save ${entityName.toLowerCase()}.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography className="page-title">{title}</Typography>
        <Typography className="page-subtitle">{subtitle}</Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Card className="glass-panel">
        <CardContent component="form" onSubmit={handleSubmit}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField label={`${entityName} Name`} value={name} onChange={(event) => setName(event.target.value)} fullWidth required />
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={() => { setEditingId(null); setName(''); }}>Clear</Button>
              <Button variant="contained" type="submit" disabled={saving}>{editingId ? `Update ${entityName}` : `Add ${entityName}`}</Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card className="glass-panel">
        <CardContent>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 560 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.isActive ? 'Active' : 'Inactive'}</TableCell>
                    <TableCell align="right">
                      <Button onClick={() => { setEditingId(item.id); setName(item.name); }}>Edit</Button>
                      <Button color="error" onClick={async () => {
                        try {
                          setError('');
                          await service.remove(item.id);
                          await load();
                        } catch (deleteError) {
                          setError(deleteError.response?.data?.detail ?? `Unable to delete ${entityName.toLowerCase()}.`);
                        }
                      }}>Delete</Button>
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

export default MasterCrudPage;
