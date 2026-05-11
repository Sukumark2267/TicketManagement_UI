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

import PageLoader from '../../components/PageLoader';
import { api } from '../../services/api';

const TechnicianDetailsPage = () => {
  const { id } = useParams();
  const [technician, setTechnician] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        setTechnician(await api.users.byId(id));
      } catch (loadError) {
        setError(loadError.response?.data?.detail ?? 'Unable to load technician details.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  if (loading) {
    return <PageLoader />;
  }

  if (!technician) {
    return <Alert severity="error">{error || 'Unable to load technician.'}</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Box className="page-header">
        <Box>
          <Typography className="page-title">{technician.firstName} {technician.lastName}</Typography>
          <Typography className="page-subtitle">{technician.email}</Typography>
        </Box>
        <Button component={Link} to={`/users/technicians/${technician.id}/edit`} variant="contained">Edit Technician</Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card className="glass-panel">
            <CardContent>
              <Typography variant="h6" gutterBottom>Technician Info</Typography>
              <Typography><strong>Name:</strong> {technician.firstName} {technician.lastName}</Typography>
              <Typography><strong>Email:</strong> {technician.email}</Typography>
              <Typography><strong>Phone:</strong> {technician.phone}</Typography>
              <Typography><strong>Username:</strong> {technician.username}</Typography>
              <Typography><strong>Role:</strong> {technician.roleName}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="glass-panel">
            <CardContent>
              <Typography variant="h6" gutterBottom>Status</Typography>
              <Typography><strong>Status:</strong> {technician.isActive ? 'Active' : 'Inactive'}</Typography>
              <Typography sx={{ mt: 1 }}><strong>Created:</strong> {new Date(technician.createdAt).toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default TechnicianDetailsPage;
