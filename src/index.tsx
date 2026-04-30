import React from "react";
import ReactDOM from "react-dom/client";
import "src/styles/global.css";
import "src/assets/css/index.css";
import { AuthProvider } from "src/features/auth/hooks/useAuth";
import { NotificationProvider } from "src/shared/hooks/useNotification";
import { LibraryProvider } from "./utils/LibProvider";
import { MultiProvider } from "./utils/MultiProvider";
import App from "src/app/App";
import ThemeProvider from "src/theme/ThemeProvider";

const libraries = {
  lsf: {
    scriptSrc: "/lsf.js",
    cssSrc: "/lsf.css",
    checkAvailability: () => !!window.LabelStudio,
  },
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <MultiProvider
    providers={[
      <LibraryProvider key="lsf" libraries={libraries} />,
      <AuthProvider key="auth">{null}</AuthProvider>,
      <NotificationProvider key="notification">{null}</NotificationProvider>,
    ]}
  >
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </MultiProvider>,
);
