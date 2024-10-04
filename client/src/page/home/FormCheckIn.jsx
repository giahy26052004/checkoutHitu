import { ErrorMessage, Field, Form } from "formik";
import { AiFillCamera } from "react-icons/ai";
import CheckCamera from "./CheckCamera";
import PropTypes from "prop-types";
import { useState } from "react";
import { imageToBase64 } from "../../ulits/imageToBase64";

const FormCheckIn = (props) => {
  const {
    handleChange,
    handleBlur,

    values,
    errors,
    dataFetch,
    handleChangeGroup,
    touched,
    isSubmitting,
    image,
    setImage,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const isMobile = window.innerWidth <= 768;

  const handleChangeCameraMobile = (e) => {
    const file = e.target.files[0];
    imageToBase64(file).then((res) => {
      setImage(res);
    });
  };

  return (
    <Form>
      <div className="mx-auto max-w-lg mt-8">
        <div className="py-2">
          <label
            htmlFor="group"
            className="px-1 mb-2 capitalize text-sm text-gray-600"
          >
            Chọn công đoàn
          </label>
          <select
            name="group"
            onChange={(e) => {
              handleChange(e);
              handleChangeGroup(e);
            }}
            onBlur={handleBlur}
            value={values.group}
            className={`text-md capitalize block px-3 py-2 rounded-lg w-full 
              bg-white border-2 border-gray-300 placeholder-gray-600 shadow-md 
              focus:placeholder-gray-500 focus:bg-white focus:border-blue-500 
              focus:outline-none ${
                touched.group && errors.group ? "border-red-500" : ""
              }`}
          >
            <option value="">Chọn công đoàn</option>
            {dataFetch &&
              dataFetch.unionChoice.map((i, index) => {
                return (
                  <option key={index} value={i}>
                    {i}
                  </option>
                );
              })}
          </select>
          <p className="text-[12px] h-5 text-red-600">
            <ErrorMessage name="group" />
          </p>
        </div>

        <div className="py-2">
          <label
            htmlFor="magv"
            className="px-1 mb-2 capitalize text-sm text-gray-600"
          >
            Mã Giảng Viên/Nhân Viên
          </label>
          <Field
            placeholder="Mã Giảng Viên/Nhân Viên"
            type="number"
            id="magv"
            name="magv"
            className={`text-md block px-3 py-2 rounded-lg w-full 
              bg-white border-2 border-gray-300 placeholder-gray-600 shadow-md 
              focus:placeholder-gray-500 focus:bg-white focus:border-blue-500 
              focus:outline-none ${
                touched.magv && errors.magv ? "border-red-500" : ""
              }`}
          />
          <p className="text-[12px] h-5 text-red-600">
            <ErrorMessage name="magv" />
          </p>
        </div>

        <div className="my-2">
          {!isMobile ? (
            <span
              onClick={() => setIsOpen(true)}
              className="w-full cursor-pointer flex items-center justify-center py-2 bg-red-500 text-white rounded-lg"
            >
              Mở máy ảnh <AiFillCamera />
            </span>
          ) : (
            <div>
              <label htmlFor="file">
                <span className="w-full cursor-pointer flex items-center justify-center py-2 bg-red-500 text-white rounded-lg">
                  Mở máy ảnh <AiFillCamera />
                </span>
                <input
                  className="hidden"
                  id="file"
                  type="file"
                  onChange={handleChangeCameraMobile}
                  capture="environment"
                />
              </label>
            </div>
          )}
        </div>

        {isOpen && <CheckCamera setImage={setImage} setIsOpen={setIsOpen} />}

        {image && (
          <div className="w-full">
            <img src={image} className="w-full" alt="Uploaded image" />
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-3 text-lg font-semibold bg-blue-500 w-full text-white rounded-lg px-6 py-3 block shadow-xl hover:text-white hover:bg-blue-800"
        >
          {isSubmitting ? "Đang điểm danh" : "Điểm danh"}
        </button>
      </div>
    </Form>
  );
};

FormCheckIn.propTypes = {
  isSubmitting: PropTypes.bool,
  dataFetch: PropTypes.any,
  handleChangeGroup: PropTypes.func,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  values: PropTypes.object,
  touched: PropTypes.object,
  errors: PropTypes.object,
  image: PropTypes.string,
  setImage: PropTypes.func,
};

export default FormCheckIn;
