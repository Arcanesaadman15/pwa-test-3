import React from 'react';
import { createRoot } from "react-dom/client";
import App from './App';
import './index.css';
import { analytics } from './lib/analytics';

analytics.init();
analytics.page('app_boot');

createRoot(document.getElementById("root")!).render(<App />);
