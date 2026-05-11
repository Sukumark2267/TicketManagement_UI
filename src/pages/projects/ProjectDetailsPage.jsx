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
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const auth = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        setProject(await api.projects.byId(id));
      } catch (loadError) {
        setError(loadError.response?.data?.detail ?? 'Unable to load project details.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

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

  if (loading) {
    return <PageLoader />;
  }

  if (!project) {
    return <Alert severity="error">{error || 'Unable to load project details.'}</Alert>;
  }

  const canEdit = auth.user?.role === 'Admin';

  return (
    <Stack spacing={3}>
      <Box className="page-header">
        <Box>
          <Typography className="page-title">{project.name}</Typography>
          <Typography className="page-subtitle">
            {project.customerName} | {project.siteName}
          </Typography>
        </Box>
        {canEdit ? <Button component={Link} to={`/projects/${project.id}/edit`} variant="contained">Edit Project</Button> : null}
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Card className="glass-panel">
            <CardContent>
              <Typography variant="h6" gutterBottom>Project Details</Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>{project.projectDetails || project.description || 'NA'}</Typography>
              <Typography sx={{ mt: 2 }}><strong>Site Address:</strong> {project.siteAddress}</Typography>
              <Typography sx={{ mt: 1 }}><strong>Location:</strong> {project.location || 'NA'}</Typography>
              <Typography sx={{ mt: 1 }}><strong>Description:</strong> {project.description || 'NA'}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card className="glass-panel">
            <CardContent>
              <Typography variant="h6" gutterBottom>Project Info</Typography>
              <Typography><strong>Customer:</strong> {project.customerName}</Typography>
              <Typography><strong>Site:</strong> {project.siteName}</Typography>
              <Typography><strong>Contact Person:</strong> {project.contactPerson || 'NA'}</Typography>
              <Typography><strong>Contact Phone:</strong> {project.contactPhone || 'NA'}</Typography>
              <Typography><strong>Site User:</strong> {project.siteUserName || 'NA'}</Typography>
              <Typography><strong>Site User Email:</strong> {project.siteUserEmail || 'NA'}</Typography>
              <Typography><strong>Site User Phone:</strong> {project.siteUserPhone || 'NA'}</Typography>
              <Typography><strong>Start Date:</strong> {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'NA'}</Typography>
              <Typography><strong>Completed Date:</strong> {project.completedDate ? new Date(project.completedDate).toLocaleDateString() : 'NA'}</Typography>
              <Typography><strong>Free Onsite Service Till:</strong> {project.freeOnsiteServiceTill ? new Date(project.freeOnsiteServiceTill).toLocaleDateString() : 'NA'}</Typography>
              <Typography><strong>Under AMC:</strong> {project.isUnderAmc ? 'Yes' : 'No'}</Typography>
              <Typography><strong>AMC Start Date:</strong> {project.amcStartDate ? new Date(project.amcStartDate).toLocaleDateString() : 'NA'}</Typography>
              <Typography><strong>AMC End Date:</strong> {project.amcEndDate ? new Date(project.amcEndDate).toLocaleDateString() : 'NA'}</Typography>
              <Typography><strong>Created:</strong> {new Date(project.createdAt).toLocaleString()}</Typography>
              <Typography><strong>Updated:</strong> {project.updatedAt ? new Date(project.updatedAt).toLocaleString() : 'NA'}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card className="glass-panel">
        <CardContent>
          <Typography variant="h6" gutterBottom>Documents</Typography>
          {project.documents?.length ? (
            <Stack spacing={1.25}>
              {project.documents.map((documentItem) => (
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
        </CardContent>
      </Card>
    </Stack>
  );
};

export default ProjectDetailsPage;
