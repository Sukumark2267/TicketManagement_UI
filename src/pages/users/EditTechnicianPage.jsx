import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography
} from '@mui/material';

import PageLoader from '../../components/PageLoader';
import { api } from '../../services/api';
import { getApiErrorMessage } from '../../utils/apiErrors';

const EditTechnicianPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        const technician = await api.users.byId(id);
        setForm({
          firstName: technician.firstName,
          lastName: technician.lastName,
          email: technician.email,
          phone: technician.phone,
          username: technician.username
        });
      } catch (loadError) {
        setError(getApiErrorMessage(loadError, 'Unable to load technician.'));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError('');
      await api.users.update(id, form);
      navigate(`/users/technicians/${id}`);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, 'Unable to update technician.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!form) {
    return <Alert severity="error">{error || 'Unable to load technician.'}</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography className="page-title">Edit Technician</Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Card className="glass-panel">
        <CardContent component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {[
              ['firstName', 'First Name'],
              ['lastName', 'Last Name'],
              ['email', 'Email'],
              ['phone', 'Phone'],
              ['username', 'Username']
            ].map(([field, label]) => (
              <Grid item xs={12} md={6} key={field}>
                <TextField
                  fullWidth
                  required
                  label={label}
                  type={field === 'email' ? 'email' : 'text'}
                  value={form[field]}
                  onChange={handleChange(field)}
                />
              </Grid>
            ))}
          </Grid>

          <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button component={Link} to={`/users/technicians/${id}`} variant="outlined">Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting}>Save Changes</Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default EditTechnicianPage;
