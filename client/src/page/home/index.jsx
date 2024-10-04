import { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db, storage } from "../../firebaseConfig";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import base64ToBlob from "../../ulits/base64";
import { useAddress } from "../../hook";
import Loading from "../../components/Loading";
import FormCheckIn from "./FormCheckIn";
import { useToasts } from "react-toast-notifications";

const Home = () => {
  const [dataFetch, setDataFetch] = useState({
    TitleHome: "",
    unionChoice: [],
  });
  const [group, setGroup] = useState("");
  const [image, setImage] = useState("");
  const colRef = collection(db, "students");
  const [loading, setLoading] = useState(false);
  const [isAllowed, setIsAllowed] = useState(true);
  const [dataVeriftyGroup, setDataVerifyGroup] = useState();
  const { address, userPosition } = useAddress();
  console.log("address ", address);
  const [macAddresses, setMacAddresses] = useState([]);

  useEffect(() => {
    const fetchMacAddresses = async () => {
      try {
        const response = await fetch("/api/mac");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMacAddresses(data);
      } catch (error) {
        console.error("Error fetching MAC addresses:", error);
      }
    };
    fetchMacAddresses();
  }, []);

  const { addToast } = useToasts();
  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    dataVeriftyGroup.map((data) => {
      if (data.magv === values.magv) {
        setIsAllowed(false);

        resetForm();
        setImage("");
        setSubmitting(false);
        setLoading(false);
        return;
      }
    });
    if (!isAllowed)
      addToast("Đã điểm danh", {
        appearance: "info",
        autoDismiss: true,
      });
    if (!isAllowed) return;

    setSubmitting(true);
    if (!image) {
      addToast("Vui lòng chụp ảnh", {
        appearance: "error",
        autoDismiss: true,
      });

      setSubmitting(false);
      return;
    }
    setSubmitting(true);
    if (!address) {
      addToast("Vui lòng bật vị trí", {
        appearance: "error",
        autoDismiss: true,
      });

      setSubmitting(false);
      return;
    }

    setLoading(true);
    const imgBlob = base64ToBlob(image);
    const imageName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}`;
    const storageRef = ref(storage, `images/${imageName}`);

    try {
      await uploadBytes(storageRef, imgBlob);
      const url = await getDownloadURL(storageRef);
      await addDoc(colRef, {
        magv: values.magv,
        group: values.group,
        image: url,
        mac: macAddresses,
        address: address || "No address",
        position: JSON.stringify(userPosition || "No address"),
        created_at: new Date(),
      })
        .then(() => {
          addToast("Điểm danh thành công", {
            appearance: "success",
            autoDismiss: true,
          });
          resetForm();
          setImage("");
          setSubmitting(false);
          setLoading(false);
        })
        .catch(() => {
          setSubmitting(false);
          setLoading(false);
        });
    } catch (error) {
      alert(JSON.stringify(error));
      addToast("Lỗi upload", {
        appearance: "error",
        autoDismiss: true,
      });
      setLoading(false);
    }
  };

  async function DataLicense() {
    try {
      const usersCollection = collection(db, "students");
      setLoading(true);
      let q;

      if (group === "") {
        q = query(usersCollection, orderBy("created_at", "desc"));
      } else {
        q = query(usersCollection, where("group", "==", group));
      }
      const userSnapshot = await getDocs(q);
      const userList = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDataVerifyGroup(userList);
    } catch (error) {
      console.log("fetchData error: ", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    DataLicense();
  }, [group]);
  useEffect(() => {
    async function fetchData() {
      try {
        const usersCollection = collection(db, "HomeValue");
        setLoading(true);
        let q;
        q = query(usersCollection, orderBy("created_at", "desc"));
        const dataquery = await getDocs(q);

        const datane = dataquery.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const unionChoicene = datane.map((list) => list.unionChoice);
        setDataFetch({
          TitleHome: datane[0].TitleHome,

          unionChoice: unionChoicene[0], // Flatten if necessary
        });
      } catch (error) {
        console.log("fetchData error: ", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  function handleChangeGroup(e) {
    setGroup(e.target.value);
  }
  console.log("g", group);
  return (
    <div className="bg-white pb-20">
      {loading && <Loading />}
      <div className="container max-w-full mx-auto py-5 px-6">
        <div className="font-sans">
          <div className="max-w-sm mx-auto px-6">
            <div className="relative flex flex-wrap">
              <div className="w-full relative">
                <div className="mt-6">
                  <div className="mb-5 pb-1 border-b-2 text-center font-base text-blue-700">
                    <h2 className="text-xl mb-3 font-bold">
                      Điểm Danh Cuộc Thi
                    </h2>
                    <h1 className="text-2xl font-bold text-red-500">
                      {dataFetch.TitleHome}
                    </h1>
                  </div>
                  <div className="text-center text-[15px] font-semibold text-gray-500">
                    Nhập đầy đủ thông tin
                  </div>
                  <Formik
                    initialValues={{ magv: "", group: "" }}
                    validationSchema={Yup.object({
                      magv: Yup.string()
                        .length(6, "Mã giáo viên không đúng")
                        .required("Vui lòng nhập"),
                      group: Yup.string().required("Vui lòng chọn công đoàn"),
                    })}
                    onSubmit={handleSubmit}
                  >
                    {({
                      values,
                      handleChange,
                      handleBlur,
                      isSubmitting,
                      errors,
                      touched,
                    }) => (
                      <FormCheckIn
                        values={values}
                        dataFetch={dataFetch}
                        handleChangeGroup={handleChangeGroup}
                        handleSubmit={handleSubmit}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        isSubmitting={isSubmitting}
                        errors={errors}
                        touched={touched}
                        setImage={setImage}
                        image={image}
                      />
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
