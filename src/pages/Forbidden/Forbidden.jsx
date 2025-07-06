// src/pages/Forbidden.jsx
import { Link } from "react-router";

const Forbidden = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-5xl font-bold text-red-600 mb-4">403 - Forbidden</h1>
      <p className="text-lg text-gray-600 mb-6">
        You do not have permission to access this page.
      </p>
      <Link to="/" className="btn btn-primary">
        Go to Homepage
      </Link>
    </div>
  );
};

export default Forbidden;
