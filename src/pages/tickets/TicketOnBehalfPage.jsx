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

import AdminActionStrip from '../../components/AdminActionStrip';
import PageLoader from '../../components/PageLoader';
import TicketPhotoUploadField from '../../components/TicketPhotoUploadField';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const TicketOnBehalfPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [lookups, setLookups] = useState({ customers: [], projects: [], serviceTypes: [], technicians: [], categories: [], priorities: [], statuses: [] });
  const [form, setForm] = useState({
    customerId: '',
    projectId: '',
    serviceTypeId: '',
    assignedTechnicianId: '',
    categoryId: '',
    priorityId: '',
    statusId: '1',
    title: '',
    description: '',
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
        const [customers, categories, priorities, statuses, serviceTypes, technicians] = await Promise.all([
          api.customers.list({ pageNumber: 1, pageSize: 100 }),
          api.categories.list({ pageNumber: 1, pageSize: 100 }),
          api.priorities.list({ pageNumber: 1, pageSize: 100 }),
          api.statuses.list({ pageNumber: 1, pageSize: 100 }),
          api.serviceTypes.list({ pageNumber: 1, pageSize: 100 }),
          auth.user?.role === 'Admin' ? api.users.technicians({ pageNumber: 1, pageSize: 100 }) : Promise.resolve({ items: [] })
        ]);

        setLookups({
          customers: customers.items.filter((item) => item.isActive),
          projects: [],
          serviceTypes: serviceTypes.items.filter((item) => item.isActive),
          technicians: technicians.items,
          categories: categories.items,
          priorities: priorities.items,
          statuses: statuses.items
        });
      } catch (loadError) {
        setError(loadError.response?.data?.detail ?? 'Unable to load ticket form data.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [auth.user?.role]);

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

  useEffect(() => {
    const loadProjects = async () => {
      if (!form.customerId) {
        setLookups((current) => ({ ...current, projects: [] }));
        return;
      }

      try {
        const response = await api.projects.list({ pageNumber: 1, pageSize: 200, customerId: Number(form.customerId) });
        setLookups((current) => ({
          ...current,
          projects: response.items.filter((item) => item.isActive)
        }));
      } catch (loadError) {
        setError(loadError.response?.data?.detail ?? 'Unable to load customer projects.');
      }
    };

    void loadProjects();
  }, [form.customerId]);

  useEffect(() => {
    setForm((current) => {
      if (!current.projectId) {
        return current;
      }

      const exists = lookups.projects.some((item) => String(item.id) === String(current.projectId));
      return exists ? current : { ...current, projectId: '' };
    });
  }, [lookups.projects]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError('');
      const ticket = await api.tickets.createOnBehalf({
        ...form,
        customerId: Number(form.customerId),
        projectId: Number(form.projectId),
        serviceTypeId: Number(form.serviceTypeId),
        assignedTechnicianId: form.assignedTechnicianId ? Number(form.assignedTechnicianId) : null,
        categoryId: Number(form.categoryId),
        priorityId: Number(form.priorityId),
        statusId: Number(form.statusId)
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
        <Typography className="page-subtitle">Admins and technicians can choose the customer, project, and service details while raising a ticket.</Typography>
      </Box>

      <AdminActionStrip />

      {error && <Alert severity="error">{error}</Alert>}

      <Card className="glass-panel">
        <CardContent component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Customer</InputLabel>
                <Select label="Customer" value={form.customerId} onChange={handleChange('customerId')} required>
                  {lookups.customers.map((item) => <MenuItem key={item.id} value={item.id}>{item.fullName}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Project</InputLabel>
                <Select label="Project" value={form.projectId} onChange={handleChange('projectId')} required disabled={!form.customerId}>
                  {lookups.projects.map((item) => <MenuItem key={item.id} value={item.id}>{item.name} - {item.siteName}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            {auth.user?.role === 'Admin' && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Assigned Technician</InputLabel>
                  <Select label="Assigned Technician" value={form.assignedTechnicianId} onChange={handleChange('assignedTechnicianId')}>
                    <MenuItem value="">Unassigned</MenuItem>
                    {lookups.technicians.map((item) => <MenuItem key={item.id} value={item.id}>{item.firstName} {item.lastName}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Service</InputLabel>
                <Select label="Service" value={form.serviceTypeId} onChange={handleChange('serviceTypeId')} required>
                  {lookups.serviceTypes.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
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
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select label="Status" value={form.statusId} onChange={handleChange('statusId')} required>
                  {lookups.statuses.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
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
            <Button variant="outlined" onClick={() => navigate('/tickets')}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting}>Create Ticket</Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default TicketOnBehalfPage;
