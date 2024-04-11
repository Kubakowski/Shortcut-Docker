import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import App from './App.jsx';
import './App.css';

// Assuming 'root' element exists
const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <MantineProvider>
        <App />
      </MantineProvider>
    </React.StrictMode>,
  );
}

window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message);
});

postMessage({ payload: 'removeLoading' }, '*');