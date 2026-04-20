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

const OTHER_OPTION = '__other__';

const TicketOnBehalfPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [lookups, setLookups] = useState({ customers: [], projects: [], serviceTypes: [], technicians: [], categories: [], priorities: [], statuses: [] });
  const [form, setForm] = useState({
    customerSelection: '',
    projectSelection: '',
    otherCustomerName: '',
    otherProjectName: '',
    serviceTypeId: '',
    assignedTechnicianId: '',
    categoryId: '',
    priorityId: '',
    statusId: '1',
    title: '',
    description: '',
    remarks: '',
    partsOrItemsUsed: '',
    totalAmountPaid: '',
    photos: []
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isOtherCustomer = form.customerSelection === OTHER_OPTION;
  const isOtherProject = form.projectSelection === OTHER_OPTION;

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

  const handleCustomerChange = (event) => {
    const value = event.target.value;
    setForm((current) => ({
      ...current,
      customerSelection: value,
      projectSelection: value === OTHER_OPTION ? OTHER_OPTION : '',
      otherCustomerName: value === OTHER_OPTION ? current.otherCustomerName : '',
      otherProjectName: value === OTHER_OPTION ? current.otherProjectName : ''
    }));
    setError('');
  };

  const handleProjectChange = (event) => {
    const value = event.target.value;
    setForm((current) => ({
      ...current,
      projectSelection: value,
      otherProjectName: value === OTHER_OPTION ? current.otherProjectName : ''
    }));
    setError('');
  };

  useEffect(() => {
    const loadProjects = async () => {
      if (!form.customerSelection || form.customerSelection === OTHER_OPTION) {
        setLookups((current) => ({ ...current, projects: [] }));
        return;
      }

      try {
        const response = await api.projects.list({ pageNumber: 1, pageSize: 200, customerId: Number(form.customerSelection) });
        setLookups((current) => ({
          ...current,
          projects: response.items.filter((item) => item.isActive)
        }));
      } catch (loadError) {
        setError(loadError.response?.data?.detail ?? 'Unable to load customer projects.');
      }
    };

    void loadProjects();
  }, [form.customerSelection]);

  useEffect(() => {
    setForm((current) => {
      if (!current.projectSelection || current.projectSelection === OTHER_OPTION) {
        return current;
      }

      const exists = lookups.projects.some((item) => String(item.id) === String(current.projectSelection));
      return exists ? current : { ...current, projectSelection: '' };
    });
  }, [lookups.projects]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError('');
      const ticket = await api.tickets.createOnBehalf({
        ...form,
        customerId: isOtherCustomer ? null : Number(form.customerSelection),
        projectId: isOtherProject ? null : Number(form.projectSelection),
        otherCustomerName: isOtherCustomer ? form.otherCustomerName.trim() : null,
        otherProjectName: isOtherProject ? form.otherProjectName.trim() : null,
        serviceTypeId: Number(form.serviceTypeId),
        assignedTechnicianId: form.assignedTechnicianId ? Number(form.assignedTechnicianId) : null,
        categoryId: Number(form.categoryId),
        priorityId: Number(form.priorityId),
        statusId: Number(form.statusId),
        totalAmountPaid: form.totalAmountPaid ? Number(form.totalAmountPaid) : null
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

      <AdminActionStrip />

      {error && <Alert severity="error">{error}</Alert>}

      <Card className="glass-panel">
        <CardContent component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Customer</InputLabel>
                <Select label="Customer" value={form.customerSelection} onChange={handleCustomerChange} required>
                  {lookups.customers.map((item) => <MenuItem key={item.id} value={item.id}>{item.fullName}</MenuItem>)}
                  <MenuItem value={OTHER_OPTION}>Others</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Project</InputLabel>
                <Select label="Project" value={form.projectSelection} onChange={handleProjectChange} required disabled={!form.customerSelection}>
                  {lookups.projects.map((item) => <MenuItem key={item.id} value={item.id}>{item.name} - {item.siteName}</MenuItem>)}
                  {form.customerSelection ? <MenuItem value={OTHER_OPTION}>Others</MenuItem> : null}
                </Select>
              </FormControl>
            </Grid>
            {isOtherCustomer ? (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Other Customer"
                  value={form.otherCustomerName}
                  onChange={handleChange('otherCustomerName')}
                />
              </Grid>
            ) : null}
            {isOtherProject ? (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Other Project"
                  value={form.otherProjectName}
                  onChange={handleChange('otherProjectName')}
                />
              </Grid>
            ) : null}
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
                photos={form.photos}
                onChange={(photos) => setForm((current) => ({ ...current, photos }))}
                onError={setError}
              />
            </Grid>
            <Grid item xs={12}><TextField fullWidth multiline minRows={4} label="Description" value={form.description} onChange={handleChange('description')} required /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline minRows={2} label="Remarks" value={form.remarks} onChange={handleChange('remarks')} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline minRows={3} label="Parts / Items Used" value={form.partsOrItemsUsed} onChange={handleChange('partsOrItemsUsed')} /></Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Total Amount Paid"
                type="number"
                inputProps={{ min: 0, step: '0.01' }}
                value={form.totalAmountPaid}
                onChange={handleChange('totalAmountPaid')}
              />
            </Grid>
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
