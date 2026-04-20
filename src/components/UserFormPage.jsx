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
import { getApiErrorMessage } from '../utils/apiErrors';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  username: '',
  password: ''
};

const UserFormPage = ({ title, subtitle, cancelTo, submitLabel, onSubmit }) => {
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
      await onSubmit(form);
      navigate(cancelTo);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, 'Unable to save user.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography className="page-title">{title}</Typography>
        <Typography className="page-subtitle">{subtitle}</Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Card className="glass-panel">
        <CardContent component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {Object.entries({
              firstName: 'First Name',
              lastName: 'Last Name',
              email: 'Email',
              phone: 'Phone',
              username: 'Username',
              password: 'Password'
            }).map(([field, label]) => (
              <Grid item xs={12} md={6} key={field}>
                <TextField
                  fullWidth
                  required
                  type={field === 'password' ? 'password' : 'text'}
                  label={label}
                  value={form[field]}
                  onChange={handleChange(field)}
                />
              </Grid>
            ))}
          </Grid>

          <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button component={Link} to={cancelTo} variant="outlined">Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting}>{submitLabel}</Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default UserFormPage;
