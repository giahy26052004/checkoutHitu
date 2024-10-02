import React, { useEffect } from "react";
import { useRoutes } from "react-router-dom";
import Layout from "./layout";
import Home from "./page/home";
import { ToastContainer } from "react-toastify";
import LayoutAdmin from "./layout/LayoutAdmin";
import Dashboard from "./page/admin";
import Login from "./page/admin/Login";
import Register from "./page/admin/Register";
import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import AddStudent from "./page/admin/AddStudent/AddStudent";
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

  useEffect(() => {
    const testFirebaseConnection = async () => {
      try {
        const usersCollection = collection(db, "students");
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    testFirebaseConnection();
  }, []);

  return (
    <>
      {useRoutes(routes)}
      <ToastContainer />
    </>
  );
}

export default App;
