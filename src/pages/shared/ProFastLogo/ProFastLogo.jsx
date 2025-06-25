import { Link } from "react-router";
import logo from "../../../assets/logo.png";

const ProFastLogo = () => {
  return (
    <div className="flex items-end">
      <img className="mb-2" src={logo} alt="ProFast Logo" />
      <Link to={"/"}>
        <p className="text-3xl font-extrabold -ml-3.5">Profast</p>
      </Link>
    </div>
  );
};

export default ProFastLogo;
