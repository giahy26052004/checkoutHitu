import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { useToasts } from "react-toast-notifications";

import "./AddStudent.css"; // Import CSS
import { db } from "../../../firebaseConfig";

const AddStudent = () => {
  const colRef = collection(db, "students");
  const [newItem, setNewItem] = useState({
    magv: "",
    group: "",
    address: "",
    image: "",
    created_at: new Date(),
  });
  const { addToast } = useToasts();
  const handleAddData = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(colRef, newItem);
      addToast(message, { appearance: "success", autoDismiss: true });
      setNewItem({ magv: "", group: "", address: "", image: "" });
    } catch (error) {
      console.log("handleAddData error: ", error);
      addToast("Error Vui lòng thử lại.!", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  return (
    <form onSubmit={handleAddData} className="mb-4">
      <input
        type="text"
        placeholder="Mã Giảng Viên"
        value={newItem.magv}
        onChange={(e) => setNewItem({ ...newItem, magv: e.target.value })}
        required
      />
      <select
        value={newItem.group}
        onChange={(e) => setNewItem({ ...newItem, group: e.target.value })}
        required
      >
        <option value="">Chọn Công Đoàn</option>
        <option value="CĐ Công Nghệ">CĐ Công Nghệ</option>
        <option value="CĐ Kỹ Thuật">CĐ Kỹ Thuật</option>
        <option value="CĐ Kinh Tế">CĐ Kinh Tế</option>
        <option value="CĐ Phòng Ban">CĐ Phòng Ban</option>
        <option value="CĐ Đào Tạo">CĐ Đào Tạo</option>
        <option value="CĐ Đại cương">CĐ Đại cương</option>
      </select>
      <input
        type="text"
        placeholder="Địa chỉ"
        value={newItem.address}
        onChange={(e) => setNewItem({ ...newItem, address: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="URL hình ảnh"
        value={newItem.image}
        onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
        required
      />
      <button type="submit">Thêm mới</button>
    </form>
  );
};

export default AddStudent;
