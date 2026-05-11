import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';

const maxDocumentSizeBytes = 15 * 1024 * 1024;

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error('Unable to read the selected document.'));
  reader.readAsDataURL(file);
});

const base64ToBlob = (base64, contentType) => {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: contentType || 'application/octet-stream' });
};

const ProjectDocumentsUploadField = ({ documents = [], onChange, onError }) => {
  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';

    if (!files.length) {
      return;
    }

    try {
      const nextDocuments = [...documents];

      for (const file of files) {
        if (file.size > maxDocumentSizeBytes) {
          throw new Error('Each project document size cannot exceed 15 MB.');
        }

        const dataUrl = await readFileAsDataUrl(file);
        const base64 = String(dataUrl).split(',')[1] ?? '';

        if (!base64) {
          throw new Error('Unable to read the selected document.');
        }

        nextDocuments.push({
          fileName: file.name,
          contentType: file.type || 'application/octet-stream',
          base64
        });
      }

      onChange(nextDocuments);
      onError?.('');
    } catch (error) {
      onError?.(error.message || 'Unable to upload the selected document.');
    }
  };

  const openDocument = (fileItem, download = false) => {
    if (!fileItem?.base64) {
      return;
    }

    const blob = base64ToBlob(fileItem.base64, fileItem.contentType);
    const documentUrl = URL.createObjectURL(blob);

    if (download) {
      const link = window.document.createElement('a');
      link.href = documentUrl;
      link.download = fileItem.fileName || 'project-document';
      link.click();
    } else {
      window.open(documentUrl, '_blank', 'noopener,noreferrer');
    }

    window.setTimeout(() => URL.revokeObjectURL(documentUrl), 60000);
  };

  const handleDelete = (index) => {
    onChange(documents.filter((_, currentIndex) => currentIndex !== index));
  };

  return (
    <Stack spacing={1.25}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" useFlexGap>
        <Box>
          <Typography fontWeight={700}>Documents</Typography>
          <Typography variant="body2" color="text.secondary">
            Upload project files or supporting documents.
          </Typography>
        </Box>
        <Button component="label" variant="outlined" startIcon={<CloudUploadOutlinedIcon />}>
          Upload Documents
          <input hidden type="file" multiple onChange={handleFileChange} />
        </Button>
      </Stack>

      {documents.length ? (
        <Stack spacing={1}>
          {documents.map((document, index) => (
            <Box
              key={`${document.fileName}-${index}`}
              sx={{
                px: 1.5,
                py: 1.2,
                borderRadius: 2.5,
                border: '1px solid rgba(215,227,239,0.9)',
                backgroundColor: 'rgba(249,252,255,0.9)'
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
                <Typography sx={{ minWidth: 0, flex: 1 }} noWrap>
                  {document.fileName}
                </Typography>
                <Stack direction="row" spacing={0.5}>
                  <Tooltip title="View">
                    <IconButton size="small" onClick={() => openDocument(document)} aria-label="View document">
                      <VisibilityOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download">
                    <IconButton size="small" onClick={() => openDocument(document, true)} aria-label="Download document">
                      <DownloadOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => handleDelete(index)} aria-label="Delete document">
                      <DeleteOutlineOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      ) : null}
    </Stack>
  );
};

export default ProjectDocumentsUploadField;
