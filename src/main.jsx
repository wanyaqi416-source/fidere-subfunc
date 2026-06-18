import React from 'react';
import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App.jsx';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 768,
      lg: 1024,
      xl: 1440,
    },
  },
  palette: {
    primary: {
      main: '#217dd4',
      dark: '#1d6ebd',
      light: '#eef6ff',
    },
    success: {
      main: '#2e7d32',
      light: '#e8f5e9',
    },
    text: {
      primary: '#202124',
      secondary: '#667085',
    },
    background: {
      default: '#f6f8fb',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"PingFang SC", "Microsoft YaHei", "Inter", "Segoe UI", Arial, sans-serif',
    h5: {
      fontSize: 24,
      lineHeight: 1.35,
      fontWeight: 600,
      letterSpacing: 0,
    },
    subtitle1: {
      fontSize: 16,
      lineHeight: 1.45,
      fontWeight: 600,
      letterSpacing: 0,
    },
    body2: {
      fontSize: 14,
      lineHeight: 1.6,
      letterSpacing: 0,
    },
    caption: {
      fontSize: 12,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: 14,
      lineHeight: 1.2,
      letterSpacing: 0,
    },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderColor: '#e4e7ec',
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
