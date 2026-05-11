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

import GoogleMapsLocationField from '../../components/GoogleMapsLocationField';
import PageLoader from '../../components/PageLoader';
import { api } from '../../services/api';
import { getApiErrorMessage } from '../../utils/apiErrors';

const EditCustomerPage = () => {
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
        const customer = await api.customers.byId(id);
        setForm({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          companyName: customer.companyName || '',
          address: customer.address || '',
          location: customer.location || ''
        });
      } catch (loadError) {
        setError(getApiErrorMessage(loadError, 'Unable to load customer.'));
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
      await api.customers.update(id, form);
      navigate(`/users/customers/${id}`);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, 'Unable to update customer.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!form) {
    return <Alert severity="error">{error || 'Unable to load customer.'}</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography className="page-title">Edit Customer</Typography>
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
              ['companyName', 'Company Name']
            ].map(([field, label]) => (
              <Grid item xs={12} md={6} key={field}>
                <TextField
                  fullWidth
                  label={label}
                  required={field !== 'companyName'}
                  type={field === 'email' ? 'email' : 'text'}
                  value={form[field]}
                  onChange={handleChange(field)}
                />
              </Grid>
            ))}
            <Grid item xs={12} md={6}>
              <TextField fullWidth multiline minRows={3} label="Address" value={form.address} onChange={handleChange('address')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <GoogleMapsLocationField value={form.location} onChange={handleChange('location')} searchText={form.address} />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button component={Link} to={`/users/customers/${id}`} variant="outlined">Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting}>Save Changes</Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default EditCustomerPage;
