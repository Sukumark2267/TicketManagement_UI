import { CircularProgress, Stack } from '@mui/material';

const PageLoader = () => (
  <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '40vh' }}>
    <CircularProgress />
  </Stack>
);

export default PageLoader;
