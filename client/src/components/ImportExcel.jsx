import PropTypes from "prop-types";
import * as XLSX from "xlsx";

const ImportExcel = ({ onDataImport }) => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target.result; // Get the ArrayBuffer
      const workbook = XLSX.read(arrayBuffer, { type: "array" }); // Use 'array' type

      // Get data from the first sheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      // Call onDataImport to pass data to the parent component
      onDataImport(data);
    };

    reader.readAsArrayBuffer(file); // Use readAsArrayBuffer instead
  };

  return (
    <div className="flex">
      <label
        htmlFor="file-upload"
        className="cursor-pointer bg-gray-50 text-black py-2 px-4 rounded hover:bg-gray-100"
      >
        Chọn file Excel
      </label>
      <input
        id="file-upload"
        type="file"
        hidden
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
      />
    </div>
  );
};

ImportExcel.propTypes = {
  onDataImport: PropTypes.func.isRequired, // Validate onDataImport as a function
};

export default ImportExcel;
