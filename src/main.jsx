import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Always start in dark mode
localStorage.removeItem('chakra-ui-color-mode');

const theme = extendTheme({
  colors: {
    brand: {
      50: '#f5f6fa',
      100: '#e0e3ea',
      200: '#bfc4d6',
      300: '#8d99b2',
      400: '#5a6d8a',
      500: '#23283a', // Card/box background
      600: '#1e2230',
      700: '#181c24', // Main background
      800: '#13151b',
      900: '#0d0e12',
    },
    accent: {
      400: '#e94560', // Vibrant pink/purple accent
      500: '#e94560',
    },
    text: {
      100: '#f5f6fa', // Light text
      200: '#e0e3ea', // Muted text
    },
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  radii: {
    sm: '8px',
    md: '14px',
    lg: '18px',
  },
  shadows: {
    outline: '0 0 0 3px #e94560',
    md: '0 4px 24px 0 rgba(233, 69, 96, 0.08)',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'accent.500',
          color: 'white',
          _hover: { bg: 'accent.400' },
        },
        outline: {
          borderColor: 'accent.500',
          color: 'accent.500',
          _hover: { bg: 'brand.600' },
        },
      },
    },
    Input: {
      baseStyle: {
        borderRadius: 'md',
        bg: 'brand.500',
        color: 'text.100',
        borderColor: 'brand.400',
        _placeholder: { color: 'text.200' },
      },
    },
    Textarea: {
      baseStyle: {
        borderRadius: 'md',
        bg: 'brand.500',
        color: 'text.100',
        borderColor: 'brand.400',
        _placeholder: { color: 'text.200' },
      },
    },
    Box: {
      baseStyle: {
        borderRadius: 'md',
      },
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'brand.700' : 'brand.50',
        color: props.colorMode === 'dark' ? 'text.100' : 'brand.900',
      },
    }),
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <App />
        <Analytics />
        <SpeedInsights />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
) 