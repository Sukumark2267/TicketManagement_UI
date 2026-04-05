import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const TicketEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const [lookups, setLookups] = useState({ categories: [], priorities: [], statuses: [], serviceTypes: [], projects: [], technicians: [] });
  const [form, setForm] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const canManageWorkflow = auth.user?.role === 'Admin' || auth.user?.role === 'Technician';
  const isAdmin = auth.user?.role === 'Admin';

  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        setSuccess('');
        const [ticket, categories, priorities, statuses, serviceTypes, projects, technicians] = await Promise.all([
          api.tickets.byId(id),
          api.categories.list({ pageNumber: 1, pageSize: 100 }),
          api.priorities.list({ pageNumber: 1, pageSize: 100 }),
          api.statuses.list({ pageNumber: 1, pageSize: 100 }),
          api.serviceTypes.list({ pageNumber: 1, pageSize: 100 }),
          api.projects.list({ pageNumber: 1, pageSize: 200 }),
          isAdmin ? api.users.technicians({ pageNumber: 1, pageSize: 100 }) : Promise.resolve({ items: [] })
        ]);

        const availableProjects = projects.items.filter((item) => item.customerId === ticket.customerId && item.isActive);
        const sortedComments = [...(ticket.comments ?? [])].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));

        setForm({
          title: ticket.title,
          description: ticket.description,
          projectId: String(ticket.projectId),
          serviceTypeId: String(ticket.serviceTypeId),
          categoryId: String(ticket.categoryId),
          priorityId: String(ticket.priorityId),
          statusId: String(ticket.statusId),
          assignedTechnicianId: ticket.assignedTechnicianId ? String(ticket.assignedTechnicianId) : '',
          remarks: ticket.remarks || '',
          resolutionNotes: ticket.resolutionNotes || '',
          activityComment: ''
        });

        setComments(sortedComments);

        setLookups({
          categories: categories.items,
          priorities: priorities.items,
          statuses: statuses.items,
          serviceTypes: serviceTypes.items.filter((item) => item.isActive),
          projects: availableProjects,
          technicians: technicians.items
        });
      } catch (loadError) {
        setError(loadError.response?.data?.detail ?? 'Unable to load ticket for editing.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id, isAdmin]);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      const payload = {
        ...form,
        projectId: Number(form.projectId),
        serviceTypeId: Number(form.serviceTypeId),
        categoryId: Number(form.categoryId),
        priorityId: Number(form.priorityId),
        statusId: Number(form.statusId),
        assignedTechnicianId: form.assignedTechnicianId ? Number(form.assignedTechnicianId) : null
      };

      const ticket = await api.tickets.update(id, payload);
      const sortedComments = [...(ticket.comments ?? [])].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));

      setForm({
        title: ticket.title,
        description: ticket.description,
        projectId: String(ticket.projectId),
        serviceTypeId: String(ticket.serviceTypeId),
        categoryId: String(ticket.categoryId),
        priorityId: String(ticket.priorityId),
        statusId: String(ticket.statusId),
        assignedTechnicianId: ticket.assignedTechnicianId ? String(ticket.assignedTechnicianId) : '',
        remarks: ticket.remarks || '',
        resolutionNotes: ticket.resolutionNotes || '',
        activityComment: ''
      });
      setComments(sortedComments);
      setSuccess('Ticket updated successfully.');
    } catch (submitError) {
      setError(submitError.response?.data?.detail ?? 'Unable to update ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!form) {
    return <Alert severity="error">{error || 'Unable to load ticket.'}</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography className="page-title">Edit Ticket</Typography>
        <Typography className="page-subtitle">Update ticket details with role-based workflow control.</Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Card className="glass-panel">
        <CardContent component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}><TextField fullWidth label="Title" value={form.title} onChange={handleChange('title')} required /></Grid>
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
            {canManageWorkflow && (
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select label="Status" value={form.statusId} onChange={handleChange('statusId')} required>
                    {lookups.statuses.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            )}
            {isAdmin && (
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Assigned Technician</InputLabel>
                  <Select label="Assigned Technician" value={form.assignedTechnicianId} onChange={handleChange('assignedTechnicianId')}>
                    <MenuItem value="">Unassigned</MenuItem>
                    {lookups.technicians.map((item) => <MenuItem key={item.id} value={item.id}>{item.firstName} {item.lastName}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12}><TextField fullWidth multiline minRows={6} label="Description" value={form.description} onChange={handleChange('description')} required /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline minRows={3} label="Remarks" value={form.remarks} onChange={handleChange('remarks')} /></Grid>
            {canManageWorkflow && (
              <Grid item xs={12}><TextField fullWidth multiline minRows={3} label="Resolution Notes" value={form.resolutionNotes} onChange={handleChange('resolutionNotes')} /></Grid>
            )}
            <Grid item xs={12}>
              <Box sx={{ mt: 1, pt: 2, borderTop: '1px solid rgba(215,227,239,0.9)' }}>
                <Typography variant="h6" gutterBottom>Activity</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Add a comment while updating the ticket. Recent comments are shown first.
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Add Comment"
                  value={form.activityComment}
                  onChange={handleChange('activityComment')}
                />
                <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 2 }}>
                  <Button variant="outlined" onClick={() => navigate(`/tickets/${id}`)}>Cancel</Button>
                  <Button type="submit" variant="contained" disabled={submitting}>Save Changes</Button>
                </Stack>
                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  {comments.length ? comments.map((comment) => (
                    <Box
                      key={comment.id}
                      sx={{
                        p: 1.75,
                        borderRadius: 2.5,
                        border: '1px solid rgba(215,227,239,0.9)',
                        backgroundColor: 'rgba(249,252,255,0.85)'
                      }}
                    >
                      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1}>
                        <Box>
                          <Typography fontWeight={700}>{comment.createdByName}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {comment.createdByRole || 'User'}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(comment.createdAt).toLocaleString()}
                        </Typography>
                      </Stack>
                      <Typography sx={{ mt: 1.2, whiteSpace: 'pre-wrap' }}>{comment.comment}</Typography>
                    </Box>
                  )) : (
                    <Typography color="text.secondary">No activity comments available.</Typography>
                  )}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default TicketEditPage;
