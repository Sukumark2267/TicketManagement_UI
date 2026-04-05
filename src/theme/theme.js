import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  palette: {
    primary: {
      main: '#145b82'
    },
    secondary: {
      main: '#ff8f3d'
    },
    success: {
      main: '#16a34a'
    },
    warning: {
      main: '#f59e0b'
    },
    background: {
      default: '#f4f7fb'
    }
  },
  shape: {
    borderRadius: 18
  },
  typography: {
    fontFamily: '"Segoe UI", "Helvetica Neue", sans-serif',
    h4: {
      fontWeight: 700
    },
    h5: {
      fontWeight: 700
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 22
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          textTransform: 'none',
          fontWeight: 600
        }
      }
    }
  }
});
