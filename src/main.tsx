import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import App from './App.jsx';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme'; 
import './App.css';

// Assuming 'root' element exists
const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <MantineProvider>
          <App />
        </MantineProvider>
      </ThemeProvider>
    </React.StrictMode>,
  );
}

window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message);
});

postMessage({ payload: 'removeLoading' }, '*');