import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

import { api } from '../../services/api';
import GoogleMapsLocationField from '../../components/GoogleMapsLocationField';
import { getApiErrorMessage } from '../../utils/apiErrors';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  companyName: '',
  address: '',
  location: ''
};

const fieldConfig = [
  { field: 'firstName', label: 'First Name', required: true },
  { field: 'lastName', label: 'Last Name', required: true },
  { field: 'email', label: 'Email', required: true },
  { field: 'phone', label: 'Phone', required: true },
  { field: 'password', label: 'Password', required: true },
  { field: 'companyName', label: 'Company Name', required: false }
];

const CreateCustomerPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError('');
      await api.customers.create(form);
      navigate('/users/customers');
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, 'Unable to create customer.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography className="page-title">Create Customer</Typography>
        <Typography className="page-subtitle">Register a customer profile that can be selected while creating tickets.</Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Card className="glass-panel">
        <CardContent component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {fieldConfig.map(({ field, label, required }) => (
              <Grid item xs={12} md={6} key={field}>
                <TextField
                  fullWidth
                  required={required}
                  label={label}
                  type={field === 'email' ? 'email' : field === 'password' ? 'password' : 'text'}
                  value={form[field]}
                  onChange={handleChange(field)}
                />
              </Grid>
            ))}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Address"
                value={form.address}
                onChange={handleChange('address')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <GoogleMapsLocationField
                value={form.location}
                onChange={handleChange('location')}
                searchText={form.address}
              />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button component={Link} to="/users/customers" variant="outlined">Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting}>Create Customer</Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default CreateCustomerPage;
