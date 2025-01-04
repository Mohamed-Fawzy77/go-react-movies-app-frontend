import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import Home from "./components/Home";
import Orders from "./components/Orders";
import CreateOrder from "./CreateOrder";
import StandardProducts from "./components/StandardProducts";
import Login from "./components/Login";
import Movie from "./components/Movie";
import StandardProductDetails from "./components/StandardProductDetails";
import ProductDetails from "./components/ProductDetails";
import UsersPage from "./components/UsersPage";
import UpdateOrder from "./components/UpdateOrder";
import SingleOrderPrinter from "./components/SingleOrderPrint";
import PrintEveryThing from "./components/prints/PrintEveryThing";

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
        path: "/create-order",
        element: <CreateOrder />,
      },
      {
        path: "/order/:id",
        element: <CreateOrder update={true} />,
      },
      {
        path: "/order/print/:id",
        element: <SingleOrderPrinter />,
      },
      {
        path: "/sps",
        element: <StandardProducts />,
      },
      {
        path: "/sps/:id",
        element: <StandardProductDetails />,
      },
      {
        path: "/products/:id",
        element: <ProductDetails />,
      },
      {
        path: "/users",
        element: <UsersPage />,
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
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
);

//commit
