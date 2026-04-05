import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';

const maxPhotoSizeBytes = 5 * 1024 * 1024;

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error('Unable to read the selected image.'));
  reader.readAsDataURL(file);
});

const base64ToBlob = (base64, contentType) => {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: contentType });
};

const TicketPhotoUploadField = ({ photo, onChange, onDelete, onError }) => {
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed for ticket photo.');
      }

      if (file.size > maxPhotoSizeBytes) {
        throw new Error('Ticket photo size cannot exceed 5 MB.');
      }

      const dataUrl = await readFileAsDataUrl(file);
      const base64 = String(dataUrl).split(',')[1] ?? '';

      if (!base64) {
        throw new Error('Unable to read the selected image.');
      }

      onChange({
        fileName: file.name,
        contentType: file.type,
        base64
      });

      onError?.('');
    } catch (error) {
      onError?.(error.message || 'Unable to upload the selected image.');
    }
  };

  const handleView = () => {
    if (!photo?.base64 || !photo?.contentType) {
      return;
    }

    const blob = base64ToBlob(photo.base64, photo.contentType);
    const previewUrl = URL.createObjectURL(blob);
    window.open(previewUrl, '_blank', 'noopener,noreferrer');
    window.setTimeout(() => URL.revokeObjectURL(previewUrl), 60000);
  };

  return (
    <Stack spacing={1.25}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" useFlexGap>
        <Box>
          <Typography fontWeight={700}>Photo</Typography>
          <Typography variant="body2" color="text.secondary">
            Optional image upload for the ticket.
          </Typography>
        </Box>
        <Button component="label" variant="outlined" startIcon={<CloudUploadOutlinedIcon />}>
          Upload Photo
          <input hidden type="file" accept="image/*" onChange={handleFileChange} />
        </Button>
      </Stack>

      {photo ? (
        <Box
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
              {photo.fileName}
            </Typography>
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="View">
                <IconButton size="small" onClick={handleView} aria-label="View photo">
                  <VisibilityOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton size="small" onClick={onDelete} aria-label="Delete photo">
                  <DeleteOutlineOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Box>
      ) : null}
    </Stack>
  );
};

export default TicketPhotoUploadField;
