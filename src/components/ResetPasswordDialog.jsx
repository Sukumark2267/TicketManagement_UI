import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField
} from '@mui/material';

const ResetPasswordDialog = ({ open, title, submitting, error, onClose, onSubmit }) => {
  const [password, setPassword] = useState('');
  const formId = 'reset-password-dialog-form';

  useEffect(() => {
    if (open) {
      setPassword('');
    }
  }, [open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(password);
  };

  return (
    <Dialog open={open} onClose={submitting ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers component="form" id={formId} onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <TextField
            autoFocus
            fullWidth
            required
            label="New Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button type="submit" form={formId} variant="contained" disabled={submitting}>
          Reset Password
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResetPasswordDialog;
