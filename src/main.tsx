import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import { PersistGate } from "redux-persist/integration/react";

const rootElement = document.getElementById("root");

if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor} />
      <RouterProvider router={router} />
    </Provider>
    <Toaster richColors position="top-right" />
  </StrictMode>
);
