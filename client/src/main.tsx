import React from 'react';
import { createRoot } from "react-dom/client";
import App from './App';
import './index.css';
import './utils/testLemonSqueezy.ts'; // Load global test functions
import './utils/testConnection.ts'; // Load connection test function

createRoot(document.getElementById("root")!).render(<App />);
