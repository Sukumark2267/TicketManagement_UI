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

const EditCustomerLoginPage = () => {
  const { customerId, userId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        const user = await api.users.byId(userId);
        setForm({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone
        });
      } catch (loadError) {
        setError(getApiErrorMessage(loadError, 'Unable to load customer login.'));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [userId]);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError('');
      await api.users.update(userId, { ...form, username: form.email });
      navigate(`/users/customers/${customerId}/logins/${userId}`);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, 'Unable to update customer login.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!form) {
    return <Alert severity="error">{error || 'Unable to load customer login.'}</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography className="page-title">Edit Customer Login</Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Card className="glass-panel">
        <CardContent component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {[
              ['firstName', 'First Name'],
              ['lastName', 'Last Name'],
              ['email', 'Email'],
              ['phone', 'Phone']
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
            <Button component={Link} to={`/users/customers/${customerId}/logins/${userId}`} variant="outlined">Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting}>Save Changes</Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default EditCustomerLoginPage;
