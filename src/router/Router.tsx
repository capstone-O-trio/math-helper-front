import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import { OnboardingPage } from "../pages/OnboardingPage";
import { HandTrackingPage } from "../pages/HandTrackingPage";
import { LoginPage } from "../pages/LoginPage";
import { SignupPage } from "../pages/SignupPage";
import { UploadPage } from "../pages/UploadPage";
import { SelectingTemplatePage } from "pages/SelectingTemplatePage";

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
        path: "/hands-tracker/:type",
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
      {
        path: "/select-template",
        element: <SelectingTemplatePage />,
      },
      {
        path: "/upload",
        element: <UploadPage />,
      },
    ],
  },
]);
export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
