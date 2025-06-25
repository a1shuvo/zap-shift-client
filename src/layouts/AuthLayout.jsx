import { Outlet } from "react-router";
import authImage from "../assets/authImage.png";
import ProFastLogo from "../pages/shared/ProFastLogo/ProFastLogo";

const AuthLayout = () => {
  return (
    <div className="pl-4 md:pl-8 lg:pl-16 bg-base-100">
      <div className="flex flex-row-reverse">
        <div className="flex-1 bg-[#FAFDF0] min-h-screen hidden md:flex">
          <img className="py-16 w-fit h-fit" src={authImage} alt="Auth Image" />
        </div>
        <div className="flex-1">
          <div className="pt-4">
            <ProFastLogo></ProFastLogo>
          </div>
          <div className="py-4 px-4 md:px-16 lg:px-32 ">
            <Outlet></Outlet>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
