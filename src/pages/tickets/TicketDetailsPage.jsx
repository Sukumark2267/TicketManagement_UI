import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import PageLoader from '../../components/PageLoader';
import { api } from '../../services/api';

const TicketDetailsPage = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        const response = await api.tickets.byId(id);
        setTicket({
          ...response,
          comments: [...(response.comments ?? [])].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
        });
      } catch (loadError) {
        setError(loadError.response?.data?.detail ?? 'Unable to load ticket details.');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  const handleViewPhoto = async () => {
    try {
      setError('');
      const blob = await api.tickets.photo(id);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener,noreferrer');
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (loadError) {
      setError(loadError.response?.data?.detail ?? 'Unable to load ticket photo.');
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!ticket) {
    return <Alert severity="error">{error || 'Unable to load ticket details.'}</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Box className="page-header">
        <Box>
          <Typography className="page-title">{ticket.ticketNumber} - {ticket.title}</Typography>
          <Typography className="page-subtitle">
            Customer: {ticket.customerName} | Project: {ticket.projectName} | Service: {ticket.serviceTypeName}
          </Typography>
        </Box>
        <Button component={Link} to={`/tickets/${ticket.id}/edit`} variant="contained">Edit Ticket</Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Card className="glass-panel">
            <CardContent>
              <Typography variant="h6" gutterBottom>Description</Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>{ticket.description}</Typography>
              <Typography sx={{ mt: 2 }}><strong>Remarks:</strong> {ticket.remarks || 'NA'}</Typography>
              <Typography><strong>Resolution Notes:</strong> {ticket.resolutionNotes || 'NA'}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card className="glass-panel">
            <CardContent>
              <Typography variant="h6" gutterBottom>Ticket Info</Typography>
              <Typography><strong>Project:</strong> {ticket.projectName}</Typography>
              <Typography><strong>Service:</strong> {ticket.serviceTypeName}</Typography>
              <Typography><strong>Category:</strong> {ticket.categoryName}</Typography>
              <Typography><strong>Priority:</strong> {ticket.priorityName}</Typography>
              <Typography><strong>Status:</strong> {ticket.statusName}</Typography>
              <Typography><strong>Created By:</strong> {ticket.createdByName}</Typography>
              <Typography><strong>Assigned Technician:</strong> {ticket.assignedTechnicianName || 'Unassigned'}</Typography>
              <Typography><strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleString()}</Typography>
              <Typography><strong>Updated At:</strong> {ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleString() : 'NA'}</Typography>
              <Typography><strong>Closed At:</strong> {ticket.closedAt ? new Date(ticket.closedAt).toLocaleString() : 'NA'}</Typography>
              {ticket.hasPhoto ? (
                <Button variant="outlined" size="small" startIcon={<VisibilityOutlinedIcon />} sx={{ mt: 2 }} onClick={handleViewPhoto}>
                  View Photo
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card className="glass-panel">
        <CardContent>
          <Typography variant="h6" gutterBottom>Comments</Typography>
          {ticket.comments.length
            ? ticket.comments.map((comment) => (
                <Box key={comment.id} sx={{ py: 1.5, borderBottom: '1px solid rgba(215,227,239,0.9)' }}>
                  <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1}>
                    <Box>
                      <Typography fontWeight={700}>{comment.createdByName}</Typography>
                      <Typography variant="body2" color="text.secondary">{comment.createdByRole || 'User'}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">{new Date(comment.createdAt).toLocaleString()}</Typography>
                  </Stack>
                  <Typography sx={{ mt: 1 }}>{comment.comment}</Typography>
                </Box>
              ))
            : <Typography color="text.secondary">No comments available.</Typography>}
        </CardContent>
      </Card>
    </Stack>
  );
};

export default TicketDetailsPage;
