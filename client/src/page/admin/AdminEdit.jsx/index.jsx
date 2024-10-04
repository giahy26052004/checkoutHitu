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
import { AiFillLeftCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const AdminEdit = () => {
  const { addToast } = useToasts();
  const [isLoading, setLoading] = useState(false);
  const colRef = collection(db, "HomeValue");
  const [values, setValues] = useState({
    TitleHome: "",
    unionChoice: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const q = query(colRef, orderBy("created_at", "desc"));
        const userSnapshot = await getDocs(q);
        const data = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (data.length > 0) {
          setValues({
            TitleHome: data[0].TitleHome || "",
            unionChoice: data[0].unionChoice || [],
          });
        }
      } catch (error) {
        console.error("fetchData error: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleUnionChoiceChange = (index, value) => {
    const newUnionChoice = [...values.unionChoice];
    newUnionChoice[index] = value;
    setValues((prev) => ({ ...prev, unionChoice: newUnionChoice }));
  };

  const addUnionChoice = () => {
    setValues((prev) => ({
      ...prev,
      unionChoice: [...prev.unionChoice, ""],
    }));
  };

  const removeUnionChoice = (index) => {
    const newUnionChoice = values.unionChoice.filter((_, i) => i !== index);
    setValues((prev) => ({ ...prev, unionChoice: newUnionChoice }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await addDoc(colRef, values);
      addToast("Add Success", { appearance: "success", autoDismiss: true });
    } catch (error) {
      addToast(error.message, { appearance: "error", autoDismiss: true });
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center p-4">
      <div
        onClick={() => navigate("/admin")}
        className="flex items-center cursor-pointer mb-4"
      >
        <AiFillLeftCircle size={40} color="blue" />
      </div>
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-4">Edit Home</h2>
        <div className="mb-4">
          <label className="block mb-2">
            Song Title:
            <input
              type="text"
              name="TitleHome"
              value={values.TitleHome}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              placeholder="Enter song title"
            />
          </label>
        </div>
        <div>
          <label className="block mb-2">Union Choices:</label>
          {values.unionChoice.map((choice, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={choice}
                onChange={(e) => handleUnionChoiceChange(index, e.target.value)}
                className="p-2 border border-gray-300 rounded w-full mr-2"
                placeholder={`Choice ${index + 1}`}
              />
              <button
                className="bg-red-500 text-white p-2 rounded"
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
            className="mt-2 bg-blue-600 text-white p-2 rounded"
          >
            Add Union Choice
          </button>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className={`mt-4 p-2 rounded w-full ${
            isLoading ? "bg-gray-400" : "bg-green-600 text-white"
          }`}
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default AdminEdit;
