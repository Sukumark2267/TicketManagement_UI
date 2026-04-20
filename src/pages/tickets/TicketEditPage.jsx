import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import PageLoader from '../../components/PageLoader';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const TicketEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const [lookups, setLookups] = useState({ categories: [], priorities: [], statuses: [], serviceTypes: [], technicians: [] });
  const [ticketInfo, setTicketInfo] = useState(null);
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
        const [ticket, categories, priorities, statuses, serviceTypes, technicians] = await Promise.all([
          api.tickets.byId(id),
          api.categories.list({ pageNumber: 1, pageSize: 100 }),
          api.priorities.list({ pageNumber: 1, pageSize: 100 }),
          api.statuses.list({ pageNumber: 1, pageSize: 100 }),
          api.serviceTypes.list({ pageNumber: 1, pageSize: 100 }),
          isAdmin ? api.users.technicians({ pageNumber: 1, pageSize: 100 }) : Promise.resolve({ items: [] })
        ]);

        const sortedComments = [...(ticket.comments ?? [])].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));

        setTicketInfo(ticket);
        setForm({
          serviceTypeId: String(ticket.serviceTypeId),
          categoryId: String(ticket.categoryId),
          priorityId: String(ticket.priorityId),
          statusId: String(ticket.statusId),
          assignedTechnicianId: ticket.assignedTechnicianId ? String(ticket.assignedTechnicianId) : '',
          resolutionNotes: ticket.resolutionNotes || '',
          partsOrItemsUsed: ticket.partsOrItemsUsed || '',
          totalAmountPaid: ticket.totalAmountPaid ?? '',
          activityComment: ''
        });
        setComments(sortedComments);

        setLookups({
          categories: categories.items,
          priorities: priorities.items,
          statuses: statuses.items,
          serviceTypes: serviceTypes.items.filter((item) => item.isActive),
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

  const ticketPhotos = useMemo(() => {
    if (!ticketInfo) {
      return [];
    }

    if (ticketInfo.photos?.length) {
      return ticketInfo.photos;
    }

    return ticketInfo.hasPhoto ? [{ id: 0, fileName: 'Ticket Photo' }] : [];
  }, [ticketInfo]);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleViewPhoto = async (photo) => {
    try {
      setError('');
      const blob = photo.id
        ? await api.tickets.photoById(id, photo.id)
        : await api.tickets.photo(id);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener,noreferrer');
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (loadError) {
      setError(loadError.response?.data?.detail ?? 'Unable to load ticket photo.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const ticket = await api.tickets.update(id, {
        title: ticketInfo.title,
        description: ticketInfo.description,
        projectId: ticketInfo.projectId ? Number(ticketInfo.projectId) : null,
        remarks: ticketInfo.remarks,
        serviceTypeId: Number(form.serviceTypeId),
        categoryId: Number(form.categoryId),
        priorityId: Number(form.priorityId),
        statusId: Number(form.statusId),
        assignedTechnicianId: form.assignedTechnicianId ? Number(form.assignedTechnicianId) : null,
        resolutionNotes: form.resolutionNotes,
        partsOrItemsUsed: form.partsOrItemsUsed,
        totalAmountPaid: form.totalAmountPaid === '' ? null : Number(form.totalAmountPaid),
        activityComment: form.activityComment
      });

      const sortedComments = [...(ticket.comments ?? [])].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));

      setTicketInfo(ticket);
      setForm({
        serviceTypeId: String(ticket.serviceTypeId),
        categoryId: String(ticket.categoryId),
        priorityId: String(ticket.priorityId),
        statusId: String(ticket.statusId),
        assignedTechnicianId: ticket.assignedTechnicianId ? String(ticket.assignedTechnicianId) : '',
        resolutionNotes: ticket.resolutionNotes || '',
        partsOrItemsUsed: ticket.partsOrItemsUsed || '',
        totalAmountPaid: ticket.totalAmountPaid ?? '',
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

  if (!form || !ticketInfo) {
    return <Alert severity="error">{error || 'Unable to load ticket.'}</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography className="page-title">Edit Ticket</Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Card className="glass-panel">
        <CardContent component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" gutterBottom>Ticket Related</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Title" value={ticketInfo.title} InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Project" value={ticketInfo.projectName || 'NA'} InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    label="Description"
                    value={ticketInfo.description}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    label="Remarks"
                    value={ticketInfo.remarks || ''}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                {ticketPhotos.length ? (
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <Typography fontWeight={700}>Photos</Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {ticketPhotos.map((photo, index) => (
                          <Button
                            key={`${photo.id ?? 'legacy'}-${index}`}
                            variant="outlined"
                            size="small"
                            startIcon={<VisibilityOutlinedIcon />}
                            onClick={() => handleViewPhoto(photo)}
                          >
                            {photo.fileName || `Photo ${index + 1}`}
                          </Button>
                        ))}
                      </Stack>
                    </Stack>
                  </Grid>
                ) : null}
              </Grid>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" gutterBottom>Update Ticket</Typography>
              <Grid container spacing={2}>
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
                {canManageWorkflow && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        label="Parts / Items Used"
                        value={form.partsOrItemsUsed}
                        onChange={handleChange('partsOrItemsUsed')}
                      />
                    </Grid>
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
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        label="Resolution Notes"
                        value={form.resolutionNotes}
                        onChange={handleChange('resolutionNotes')}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>

            <Divider />

            <Box>
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
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default TicketEditPage;
