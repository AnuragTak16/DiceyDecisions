import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { routeTree } from "./app/routeTree.gen";
import { Provider } from "react-redux";
import { store } from "./store/store";
// Import the generated route tree

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <Provider store={store}>
        {" "}
        {/* Rtk provider */}
        <RouterProvider router={router} /> {/*tanstack provider */}
      </Provider>
    </StrictMode>
  );
}
