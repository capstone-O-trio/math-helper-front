import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import { OnboardingPage } from "../pages/OnboardingPage";
import { HandTrackingPage } from "../pages/HandTrackingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/onboarding",
        element: <OnboardingPage />,
      },
      {
        path: "/hands-tracker",
        element: <HandTrackingPage />,
      },
    ],
  },
]);
export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
