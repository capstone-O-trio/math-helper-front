import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import { OnboardingPage } from "../pages/Onboarding";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/onboarding",
        element: <OnboardingPage />,
      },
    ],
  },
]);
export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
