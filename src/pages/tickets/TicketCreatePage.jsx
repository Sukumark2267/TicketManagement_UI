import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  TextField,
  Typography
} from '@mui/material';

import PageLoader from '../../components/PageLoader';
import TicketPhotoUploadField from '../../components/TicketPhotoUploadField';
import { api } from '../../services/api';

const TicketCreatePage = () => {
  const navigate = useNavigate();
  const [lookups, setLookups] = useState({ categories: [], priorities: [], projects: [] });
  const [form, setForm] = useState({
    title: '',
    description: '',
    projectId: '',
    categoryId: '',
    priorityId: '',
    remarks: '',
    photos: []
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        const [categories, priorities, projects] = await Promise.all([
          api.categories.list({ pageNumber: 1, pageSize: 100 }),
          api.priorities.list({ pageNumber: 1, pageSize: 100 }),
          api.projects.list({ pageNumber: 1, pageSize: 200 })
        ]);
        setLookups({
          categories: categories.items,
          priorities: priorities.items,
          projects: projects.items.filter((item) => item.isActive)
        });
      } catch (loadError) {
        setError(loadError.response?.data?.detail ?? 'Unable to load ticket form data.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError('');
      const ticket = await api.tickets.create({
        ...form,
        projectId: Number(form.projectId),
        categoryId: Number(form.categoryId),
        priorityId: Number(form.priorityId)
      });
      navigate(`/tickets/${ticket.id}`);
    } catch (submitError) {
      setError(submitError.response?.data?.detail ?? 'Unable to create ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography className="page-title">Create Ticket</Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Card className="glass-panel">
        <CardContent component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Project</InputLabel>
                <Select label="Project" value={form.projectId} onChange={handleChange('projectId')} required>
                  {lookups.projects.map((item) => <MenuItem key={item.id} value={item.id}>{item.name} - {item.siteName}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select label="Category" value={form.categoryId} onChange={handleChange('categoryId')} required>
                  {lookups.categories.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select label="Priority" value={form.priorityId} onChange={handleChange('priorityId')} required>
                  {lookups.priorities.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}><TextField fullWidth label="Title" value={form.title} onChange={handleChange('title')} required /></Grid>
            <Grid item xs={12}>
              <TicketPhotoUploadField
                photos={form.photos}
                onChange={(photos) => setForm((current) => ({ ...current, photos }))}
                onError={setError}
              />
            </Grid>
            <Grid item xs={12}><TextField fullWidth multiline minRows={4} label="Description" value={form.description} onChange={handleChange('description')} required /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline minRows={2} label="Remarks" value={form.remarks} onChange={handleChange('remarks')} /></Grid>
          </Grid>
          <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button variant="outlined" onClick={() => navigate('/tickets/my')}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting}>Create Ticket</Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default TicketCreatePage;
