import { createTheme } from '@mui/material/styles'

/** Figma-aligned MUI theme for the main browse shell (light). */
export const muiBrowseTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3e63dd',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9c27b0',
      contrastText: '#ffffff',
    },
    info: {
      main: '#0288d1',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#e65100',
      dark: '#e65100',
      contrastText: '#ffffff',
    },
    background: {
      default: '#faf9fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#1c2024',
      secondary: 'rgba(0,0,0,0.6)',
    },
    divider: '#eeeeee',
    grey: {
      100: '#f0f4f8',
      200: '#eeeeee',
      400: '#e8e8e8',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: 'Roboto, ui-sans-serif, system-ui, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#faf9fb',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 400,
        },
      },
    },
  },
})

export const MAP_MARKER_COLORS = {
  artist: '#9c27b0',
  instrument: '#0a2744',
  space: '#0288d1',
  collaboration: '#e65100',
}

export const SEGMENT_ACTIVE_BORDER = '#cddc39'
export const SEGMENT_ACTIVE_INNER = '#827717'
