import "./styles/globals.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { AppRouter } from "./router/Router";

import reportWebVitals from "./reportWebVitals";
import { RecoilRoot } from "recoil";

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <RecoilRoot>
    <React.StrictMode>
      <AppRouter />
    </React.StrictMode>
  </RecoilRoot>
);

reportWebVitals();
