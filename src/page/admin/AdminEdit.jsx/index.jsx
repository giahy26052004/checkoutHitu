import {
  collection,
  doc,
  getDocs,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { db } from "../../../firebaseConfig";
import { useToasts } from "react-toast-notifications";
import "./index.css";
import { AiFillLeftCircle } from "react-icons/ai";
import { useNavigate, useRoutes } from "react-router-dom";
const AdminEdit = () => {
  const { addToast } = useToasts();
  const [isLoading, setLoading] = useState(false);
  const colRef = collection(db, "HomeValue");
  const [values, setValues] = useState({
    TitleHome: "",
    unionChoice: [],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const usersCollection = collection(db, "HomeValue");
        setLoading(true);
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        let q;
        q = query(usersCollection, orderBy("created_at", "desc"));
        const dataquery = await getDocs(q);

        const datane = dataquery.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("data", datane);
        const unionChoicene = datane.map((list) => list.unionChoice);
        setValues({
          ...values,
          created_at: new Date(),
          unionChoice: unionChoicene[0], // Flatten if necessary
        });

        console.log("Home ne:", values); // In ra dữ liệu lấy được
      } catch (error) {
        console.log("fetchData error: ", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleUnionChoiceChange = (index, value) => {
    const newUnionChoice = [...values.unionChoice];
    newUnionChoice[index] = value;
    setValues((prevValues) => ({
      ...prevValues,
      unionChoice: newUnionChoice,
    }));
  };

  const addUnionChoice = () => {
    setValues((prevValues) => ({
      ...prevValues,
      unionChoice: [...prevValues.unionChoice, ""], // Add a new empty string to the array
    }));
  };

  const removeUnionChoice = (index) => {
    const newUnionChoice = values.unionChoice.filter((_, i) => i !== index);
    setValues((prevValues) => ({
      ...prevValues,
      unionChoice: newUnionChoice,
    }));
  };

  const handleSave = async () => {
    setLoading(true); // Set loading to true when starting the save operation
    try {
      await addDoc(colRef, values);
      addToast("Add Success", {
        appearance: "success",
        autoDismiss: true,
      });
    } catch (error) {
      addToast(error.message, { appearance: "error", autoDismiss: true });
    } finally {
      setLoading(false); // Reset loading state after the operation
    }
  };
  const navigate = useNavigate();
  return (
    <>
      {" "}
      <div
        onClick={() => {
          navigate("/admin");
        }}
        className="flex absolute right-14 items-center cursor-pointer"
      >
        {" "}
        <AiFillLeftCircle size={40} color="blue" />
      </div>
      <div className="flex items-center justify-center">
        <div className="w-[300px] ">
          <h2 className="text-3xl font-extrabold m-10 p-1">Edit Home</h2>
          <div>
            <label>
              Song Title:
              <input
                type="text"
                name="TitleHome"
                value={values.TitleHome}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>Union Choices:</label>
            {values.unionChoice.map((choice, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={choice}
                  onChange={(e) =>
                    handleUnionChoiceChange(index, e.target.value)
                  } // Pass index and new value
                />
                <button
                  className="bg-slate-400 m-1"
                  type="button"
                  onClick={() => removeUnionChoice(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addUnionChoice}
              className="m-5 bg-[#2f0d0d]"
            >
              Add Union Choice
            </button>{" "}
            {/* Button to add new choice */}
          </div>
          <button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}{" "}
            {/* Change button text based on loading state */}
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminEdit;
