import { AiOutlineSearch } from "react-icons/ai";
const Header = () => {
 
  return (
    <div className="">
      <div className="flex flex-wrap gap-y-4 justify-between   items-center py-3  bg-white px-5 ">
        <div>
          <img
            className="w-[500px] max-w-full"
            src="https://fit-hitu.edu.vn/wp-content/themes/fittheme/assets/images/logo.png"
            alt="image"
          />
        </div>
        <div className="md:w-[300px] w-full">
          <form action="" method="post" className="flex items-center">
            <input
              className="border-b px-3 py-2 w-full md:w-[300px] outline-none focus:border-blue-600 focus:border-b-2 border-b-blue-500"
              type="text"
              placeholder="Tìm kiếm"
            />
            <button type="submit">
              <AiOutlineSearch className="text-2xl font-bold text-blue-500 bg-white" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
  
};

export default Header;
