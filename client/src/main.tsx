import React from 'react';
import { createRoot } from "react-dom/client";
import App from './App';
import './index.css';
import { analytics } from './lib/analytics';
import { testTraitSystem, resetTraitData, checkTraitStatus } from './utils/testTraits';

// Add test utilities to global window for easy console testing
if (typeof window !== 'undefined') {
  (window as any).testTraitSystem = testTraitSystem;
  (window as any).resetTraitData = resetTraitData;
  (window as any).checkTraitStatus = checkTraitStatus;
}

analytics.init();

createRoot(document.getElementById("root")!).render(<App />);
