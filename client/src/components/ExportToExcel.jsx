import * as XLSX from "xlsx";
import PropTypes from 'prop-types'; // Add this import

const ExportToExcel = ({ data, fileName }) => {
  const handleExport = () => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Export the workbook to a file
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return <button onClick={handleExport}>Export to Excel</button>;
};

// Add prop types validation
ExportToExcel.propTypes = {
  data: PropTypes.array.isRequired, // Assuming data is an array
  fileName: PropTypes.string.isRequired, // Validate fileName as a string
};

export default ExportToExcel;
