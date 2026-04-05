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
  const [lookups, setLookups] = useState({ categories: [], priorities: [], serviceTypes: [], projects: [] });
  const [form, setForm] = useState({
    title: '',
    description: '',
    projectId: '',
    serviceTypeId: '',
    categoryId: '',
    priorityId: '',
    remarks: '',
    photoFileName: '',
    photoContentType: '',
    photoBase64: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        const [categories, priorities, serviceTypes, projects] = await Promise.all([
          api.categories.list({ pageNumber: 1, pageSize: 100 }),
          api.priorities.list({ pageNumber: 1, pageSize: 100 }),
          api.serviceTypes.list({ pageNumber: 1, pageSize: 100 }),
          api.projects.list({ pageNumber: 1, pageSize: 200 })
        ]);
        setLookups({
          categories: categories.items,
          priorities: priorities.items,
          serviceTypes: serviceTypes.items.filter((item) => item.isActive),
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

  const handlePhotoChange = (photo) => {
    setForm((current) => ({
      ...current,
      photoFileName: photo.fileName,
      photoContentType: photo.contentType,
      photoBase64: photo.base64
    }));
    setError('');
  };

  const handlePhotoDelete = () => {
    setForm((current) => ({
      ...current,
      photoFileName: '',
      photoContentType: '',
      photoBase64: ''
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError('');
      const ticket = await api.tickets.create({
        ...form,
        projectId: Number(form.projectId),
        serviceTypeId: Number(form.serviceTypeId),
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
        <Typography className="page-subtitle">Customers can create tickets only for themselves and must choose the correct project site.</Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Card className="glass-panel">
        <CardContent component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Project</InputLabel>
                <Select label="Project" value={form.projectId} onChange={handleChange('projectId')} required>
                  {lookups.projects.map((item) => <MenuItem key={item.id} value={item.id}>{item.name} - {item.siteName}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Service</InputLabel>
                <Select label="Service" value={form.serviceTypeId} onChange={handleChange('serviceTypeId')} required>
                  {lookups.serviceTypes.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select label="Category" value={form.categoryId} onChange={handleChange('categoryId')} required>
                  {lookups.categories.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
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
                photo={form.photoBase64 ? { fileName: form.photoFileName, contentType: form.photoContentType, base64: form.photoBase64 } : null}
                onChange={handlePhotoChange}
                onDelete={handlePhotoDelete}
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
