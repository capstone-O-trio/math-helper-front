import React from "react";
import { createRoot } from "react-dom/client";
import { AppRouter } from "./router/Router";

import reportWebVitals from './reportWebVitals';


const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);

reportWebVitals();