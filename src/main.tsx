import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

const root = document.getElementById('root');
if (!root) throw new Error('#root element not found');

// The dev server keeps import.meta.hot.data across hot updates, so reusing the root refreshes
// components without a page reload; builds inline it as {}
const hot = import.meta.hot.data;
hot.root ??= createRoot(root);
hot.root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
