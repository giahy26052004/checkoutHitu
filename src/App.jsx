
import { useRoutes } from "react-router-dom";
import Layout from "./layout";
import Home from "./page/home";
import { ToastContainer } from "react-toastify";
import LayoutAdmin from "./layout/LayoutAdmin";
import Dashboard from "./page/admin";
import Login from "./page/admin/Login";
import Register from "./page/admin/Register";


import AdminEdit from "./page/admin/AdminEdit.jsx";


function App() {
  const routes = [
    {
      path: "/",
      element: <Layout />,
      children: [{ index: true, element: <Home /> }], // Thay "true" thành true
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
      children: [
        { index: true, element: <Dashboard /> }, // Thay "true" thành true
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "adminEdit", element: <AdminEdit /> },
      ],
    },
  ];

  return (
    <>
      {useRoutes(routes)}
      <ToastContainer />
    </>
  );
}

export default App;
