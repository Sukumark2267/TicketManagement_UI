import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import GoogleMapsLocationField from '../../components/GoogleMapsLocationField';
import { api } from '../../services/api';

const initialState = {
  customerId: '',
  name: '',
  siteName: '',
  siteAddress: '',
  location: '',
  contactPerson: '',
  contactPhone: '',
  description: ''
};

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        const response = await api.customers.list({ pageNumber: 1, pageSize: 200 });
        setCustomers(response.items.filter((item) => item.isActive));
      } catch (loadError) {
        setError(loadError.response?.data?.detail ?? 'Unable to load customers.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError('');
      await api.projects.create({
        ...form,
        customerId: Number(form.customerId)
      });
      navigate('/projects');
    } catch (submitError) {
      setError(submitError.response?.data?.detail ?? 'Unable to create project.');
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
        <Typography className="page-title">Create Project</Typography>
        <Typography className="page-subtitle">Register project and site details for a customer installation location.</Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Card className="glass-panel">
        <CardContent component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Customer</InputLabel>
                <Select label="Customer" value={form.customerId} onChange={handleChange('customerId')}>
                  {customers.map((item) => <MenuItem key={item.id} value={item.id}>{item.fullName}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth required label="Project Name" value={form.name} onChange={handleChange('name')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth required label="Site Name" value={form.siteName} onChange={handleChange('siteName')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Contact Person" value={form.contactPerson} onChange={handleChange('contactPerson')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Contact Phone" value={form.contactPhone} onChange={handleChange('contactPhone')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth required multiline minRows={3} label="Site Address" value={form.siteAddress} onChange={handleChange('siteAddress')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <GoogleMapsLocationField
                value={form.location}
                onChange={handleChange('location')}
                searchText={form.siteAddress}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline minRows={4} label="Description" value={form.description} onChange={handleChange('description')} />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button component={Link} to="/projects" variant="outlined">Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting}>Create Project</Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default CreateProjectPage;
