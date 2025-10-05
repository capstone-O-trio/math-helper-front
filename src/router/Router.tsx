import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import { OnboardingPage } from "../pages/OnboardingPage";
import { HandTrackingPage } from "../pages/HandTrackingPage";
import { LoginPage } from "../pages/LoginPage";
import { SignupPage } from "../pages/SignupPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <OnboardingPage />,
      },
      {
        path: "/hands-tracker",
        element: <HandTrackingPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
    ],
  },
]);
export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
