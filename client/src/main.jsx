import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { ReactQueryDevtools } from "react-query/devtools";
import NotFound from "./components/Error/NotFound";
import Loading from "./components/Loading";
import Home from "./pages/Home/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NewPost from "./pages/NewPost";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Post from "./pages/Post";
import Edit from "./pages/Edit";
import Forgot from "./pages/Forgot";
import Search from "./pages/Search";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    // errorElement: <Home />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/search*",
        element: <Search />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/publish",
        element: <NewPost />,
      },
      {
        path: "/profile/:user",
        element: <Profile />,
      },
      {
        path: "/post/:post_id",
        element: <Post />,
      },
      {
        path: "/edit/:post_id",
        element: <Edit />,
      },
      {
        path: "/loading",
        element: <Loading />,
      },
      {
        path: "/forgot",
        element: <Forgot />,
      },
    ],
  },
]);
const qclient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <>
    <QueryClientProvider client={qclient}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
      {/* <ReactQueryDevtools initialIsOpen={false} position="bottom-right" /> */}
    </QueryClientProvider>
  </>
  // </React.StrictMode>,
);
