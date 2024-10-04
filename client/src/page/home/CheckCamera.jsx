import PropTypes from "prop-types";
import React from "react";
import { AiFillCamera } from "react-icons/ai";
import Webcam from "react-webcam";

const CheckCamera = ({setImage, setIsOpen}) => {
  const webcamRef = React.useRef(null);
React.useEffect(() => {
  let stream;
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((s) => {
      stream = s;
      webcamRef.current.srcObject = stream;
    })
    .catch((err) => {
      console.error("Error accessing webcam: ", err);
    });

  return () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };
}, [webcamRef]);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setIsOpen(false);
    setImage(imageSrc);
  }, [webcamRef, setImage, setIsOpen]);
  return (
    <>
      <div className="fixed z-50 top-0  left-0 right-0 bottom-0 bg-[#3333333f]">
        <div className="flex justify-center items-center relative ">
          <div>
            <Webcam
              className=" max-w-full max-h-full h-screen w-screen"
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
            />
            <span
              onClick={capture}
              className="bg-blue-500 cursor-pointer absolute bottom-10 left-[50%]  rounded-full w-16 h-16 flex items-center justify-center"
            >
              <AiFillCamera className="text-2xl text-white " />
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
CheckCamera.propTypes = {
  setImage: PropTypes.func,
  setIsOpen: PropTypes.func
};
export default CheckCamera;
