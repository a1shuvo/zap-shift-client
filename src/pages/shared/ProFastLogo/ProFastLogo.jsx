import { Link } from "react-router";
import logo from "../../../assets/logo.png";

const ProFastLogo = () => {
  return (
    <Link to={"/"}>
      <div className="flex items-end">
        <img className="mb-2" src={logo} alt="ProFast Logo" />
        <p className="text-3xl font-extrabold -ml-3.5">Profast</p>
      </div>
    </Link>
  );
};

export default ProFastLogo;
