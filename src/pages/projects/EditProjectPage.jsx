import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';

import PageLoader from '../../components/PageLoader';
import GoogleMapsLocationField from '../../components/GoogleMapsLocationField';
import ProjectDocumentsUploadField from '../../components/ProjectDocumentsUploadField';
import { api } from '../../services/api';

const EditProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(null);
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        const [project, customerResponse] = await Promise.all([
          api.projects.byId(id),
          api.customers.list({ pageNumber: 1, pageSize: 200 })
        ]);

        setCustomers(customerResponse.items.filter((item) => item.isActive));
        setExistingDocuments(project.documents ?? []);
        setForm({
          customerId: String(project.customerId),
          name: project.name,
          siteName: project.siteName,
          siteAddress: project.siteAddress,
          location: project.location || '',
          contactPerson: project.contactPerson || '',
          contactPhone: project.contactPhone || '',
          description: project.description || '',
          projectDetails: project.projectDetails || '',
          startDate: project.startDate ? project.startDate.slice(0, 10) : '',
          completedDate: project.completedDate ? project.completedDate.slice(0, 10) : '',
          freeOnsiteServiceTill: project.freeOnsiteServiceTill ? project.freeOnsiteServiceTill.slice(0, 10) : '',
          isUnderAmc: Boolean(project.isUnderAmc),
          amcStartDate: project.amcStartDate ? project.amcStartDate.slice(0, 10) : '',
          amcEndDate: project.amcEndDate ? project.amcEndDate.slice(0, 10) : '',
          siteUserId: project.siteUserId || null,
          siteUserFirstName: project.siteUserFirstName || '',
          siteUserLastName: project.siteUserLastName || '',
          siteUserEmail: project.siteUserEmail || '',
          siteUserPhone: project.siteUserPhone || '',
          siteUserPassword: '',
          documents: []
        });
      } catch (loadError) {
        setError(loadError.response?.data?.detail ?? 'Unable to load project.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleDocumentAction = async (documentItem, download = false) => {
    try {
      setError('');
      const blob = await api.projects.documentById(id, documentItem.id);
      const url = URL.createObjectURL(blob);

      if (download) {
        const link = window.document.createElement('a');
        link.href = url;
        link.download = documentItem.fileName;
        link.click();
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }

      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (loadError) {
      setError(loadError.response?.data?.detail ?? 'Unable to load project document.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError('');
      await api.projects.update(id, {
        ...form,
        customerId: Number(form.customerId),
        isUnderAmc: Boolean(form.isUnderAmc),
        startDate: form.startDate || null,
        completedDate: form.completedDate || null,
        freeOnsiteServiceTill: form.freeOnsiteServiceTill || null,
        amcStartDate: form.isUnderAmc ? form.amcStartDate || null : null,
        amcEndDate: form.isUnderAmc ? form.amcEndDate || null : null
      });
      navigate(`/projects/${id}`);
    } catch (submitError) {
      setError(submitError.response?.data?.detail ?? 'Unable to update project.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!form) {
    return <Alert severity="error">{error || 'Unable to load project.'}</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography className="page-title">Edit Project</Typography>
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
              <GoogleMapsLocationField value={form.location} onChange={handleChange('location')} searchText={form.siteAddress} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline minRows={4} label="Description" value={form.description} onChange={handleChange('description')} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline minRows={4} label="Project Details" value={form.projectDetails} onChange={handleChange('projectDetails')} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Site Login</Typography>
              <Typography color="text.secondary">Update the login details for this site user.</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth required label="Site User First Name" value={form.siteUserFirstName} onChange={handleChange('siteUserFirstName')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth required label="Site User Last Name" value={form.siteUserLastName} onChange={handleChange('siteUserLastName')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth required label="Site User Email" type="email" value={form.siteUserEmail} onChange={handleChange('siteUserEmail')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth required label="Site User Phone" value={form.siteUserPhone} onChange={handleChange('siteUserPhone')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Reset Site User Password" type="password" value={form.siteUserPassword} onChange={handleChange('siteUserPassword')} helperText="Leave blank to keep the current password." />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Start Date" type="date" InputLabelProps={{ shrink: true }} value={form.startDate} onChange={handleChange('startDate')} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Completed Date" type="date" InputLabelProps={{ shrink: true }} value={form.completedDate} onChange={handleChange('completedDate')} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Free Onsite Service Till" type="date" InputLabelProps={{ shrink: true }} value={form.freeOnsiteServiceTill} onChange={handleChange('freeOnsiteServiceTill')} />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" alignItems="center" spacing={1.25}>
                <input
                  id="edit-is-under-amc"
                  type="checkbox"
                  checked={form.isUnderAmc}
                  onChange={(event) => setForm((current) => ({ ...current, isUnderAmc: event.target.checked }))}
                />
                <Typography component="label" htmlFor="edit-is-under-amc" fontWeight={600}>
                  Is Under AMC
                </Typography>
              </Stack>
            </Grid>
            {form.isUnderAmc ? (
              <>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="AMC Start Date" type="date" InputLabelProps={{ shrink: true }} value={form.amcStartDate} onChange={handleChange('amcStartDate')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="AMC End Date" type="date" InputLabelProps={{ shrink: true }} value={form.amcEndDate} onChange={handleChange('amcEndDate')} />
                </Grid>
              </>
            ) : null}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Uploaded Documents</Typography>
              {existingDocuments.length ? (
                <Stack spacing={1.25}>
                  {existingDocuments.map((documentItem) => (
                    <Stack
                      key={documentItem.id}
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1}
                      justifyContent="space-between"
                      alignItems={{ xs: 'stretch', sm: 'center' }}
                      sx={{
                        px: 1.5,
                        py: 1.2,
                        borderRadius: 2.5,
                        border: '1px solid rgba(215,227,239,0.9)',
                        backgroundColor: 'rgba(249,252,255,0.9)'
                      }}
                    >
                      <Typography sx={{ minWidth: 0 }} noWrap>{documentItem.fileName}</Typography>
                      <Stack direction="row" spacing={1}>
                        <Button size="small" variant="outlined" onClick={() => handleDocumentAction(documentItem)}>View</Button>
                        <Button size="small" variant="outlined" onClick={() => handleDocumentAction(documentItem, true)}>Download</Button>
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary">No documents uploaded.</Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <ProjectDocumentsUploadField
                documents={form.documents}
                onChange={(documents) => setForm((current) => ({ ...current, documents }))}
                onError={setError}
              />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button component={Link} to={`/projects/${id}`} variant="outlined">Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting}>Save Changes</Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default EditProjectPage;
