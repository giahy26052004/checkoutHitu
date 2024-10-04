import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { auth } from "../../firebaseConfig"; // Đảm bảo bạn đã import firebaseConfig
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";

const Register = () => {
  const [user, setUser] = useState(null);
  const [checkAuth, setCheckAuth] = useState(false);
  const { addToast } = useToasts();
  const navigate = useNavigate();
  const handleSubmit = async (values) => {
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      localStorage.setItem("auth", res.user.accessToken);
      setUser(res);
      navigate("/admin/login");
      addToast("Đăng ký thành công!", {
        appearance: "success",
        autoDismiss: true,
      });
    } catch (error) {
      console.error("Error during registration:", error); // Log lỗi ra console

      addToast("Đăng ký không thành công. Vui lòng thử lại.!", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  return (
    <div>
      <section className="bg-[#F4F7FF] py-20 lg:py-[120px] overflow-hidden">
        <div className="container">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4">
              <div className="max-w-[525px] mx-auto text-center bg-white rounded-lg relative overflow-hidden py-16 px-10 sm:px-12 md:px-[60px]">
                <div className="mb-10 flex justify-center md:mb-16 text-center">
                  <img
                    src="https://sinhvien.hitu.edu.vn/Content/AConfig/images/sv_logo_dashboard.png"
                    alt="ddddd"
                  />
                </div>
                <Formik
                  initialValues={{
                    email: "",
                    password: "",
                  }}
                  validationSchema={Yup.object({
                    email: Yup.string()
                      .email("Email không hợp lệ")
                      .required("Trường này không được để trống"),
                    password: Yup.string()
                      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
                      .required("Trường này không được để trống"),
                  })}
                  onSubmit={async (value, { resetForm }) => {
                    await handleSubmit(value);
                    resetForm();
                  }}
                >
                  {({ values }) => (
                    <Form>
                      <div className="mb-6">
                        <Field
                          type="text"
                          placeholder="Email"
                          name="email"
                          className="w-full rounded-md border py-3 px-5 bg-[#FCFDFE] text-base text-body-color placeholder-[#ACB6BE] outline-none focus-visible:shadow-none focus:border-primary"
                        />
                        <p className="text-[12px] text-left h-5 text-red-600">
                          <ErrorMessage name="email" />
                        </p>
                      </div>
                      <div className="mb-6">
                        <Field
                          name="password"
                          type="password"
                          placeholder="Password"
                          className="w-full rounded-md border py-3 px-5 bg-[#FCFDFE] text-base text-body-color placeholder-[#ACB6BE] outline-none focus-visible:shadow-none focus:border-primary"
                        />
                        <p className="text-[12px] text-left h-5 text-red-600">
                          <ErrorMessage name="password" />
                        </p>
                      </div>
                      <div className="mb-10">
                        <button
                          type="submit"
                          className="w-full rounded-md border border-blue-800 py-3 px-5 bg-blue-500 text-base text-white cursor-pointer hover:bg-opacity-90 transition"
                        >
                          Đăng ký
                        </button>
                      </div>
                      <button className="bg-gray-200 p-3 rounded-lg float-left">
                        Back
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
