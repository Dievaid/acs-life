import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AdminPanel from './components/AdminPanel';
import AuthProvider from './components/AuthProvider';
import { ViewTypeProvider } from './components/ViewTypeProvider';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/admin-panel",
    element: <AdminPanel />
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <ChakraProvider>
      <React.StrictMode>
        <AuthProvider>
          <ViewTypeProvider>
            <RouterProvider router={router} />
          </ViewTypeProvider>
        </AuthProvider>
      </React.StrictMode>
  </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
