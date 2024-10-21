import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import Home from "./components/Home";
import Orders from "./components/Orders";
import Genres from "./Genres";
import EditMovie from "./components/EditMovie";
import ManageCatalogue from "./components/ManageCatalouge";
import GraphQL from "./components/GraphQL";
import Login from "./components/Login";
import Movie from "./components/Movie";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/home",
        element: <Home />,
      },

      {
        path: "/orders",
        element: <Orders />,
      },
      {
        path: "/movies/:id",
        element: <Movie />,
      },
      {
        path: "/genres",
        element: <Genres />,
      },
      {
        path: "/admin/movie/0",
        element: <EditMovie />,
      },
      {
        path: "/manage-catalogue",
        element: <ManageCatalogue />,
      },
      {
        path: "/graphql",
        element: <GraphQL />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
