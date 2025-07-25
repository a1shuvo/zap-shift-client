import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
import SocialLogin from "../SocialLogin/SocialLogin";

const Login = () => {
  const { signIn } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const location = useLocation();
  const axiosInstance = useAxios();
  const from = location.state?.from || "/";

  const onSubmit = async (data) => {
    try {
      const result = await signIn(data.email, data.password);
      const userInfo = {
        email: result?.user?.email,
        role: "user", // Default role
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };
      const res = await axiosInstance.post("/users", userInfo);
      console.log(res.data);
      navigate(from);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="card bg-base-100 w-full">
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="font-semibold">Login with Profast</p>
            <label className="label">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="input"
              placeholder="Email"
            />
            {errors.email?.type === "required" && (
              <p className="text-red-500">Email is required!</p>
            )}
            <label className="label">Password</label>
            <input
              type="password"
              {...register("password", { required: true, minLength: 6 })}
              className="input"
              placeholder="Password"
            />
            {errors.password?.type === "required" && (
              <p className="text-red-500">Password is required!</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-500">
                Password must be 6 characters or long!
              </p>
            )}
            <div>
              <a className="link link-hover">Forgot password?</a>
            </div>
            <button className="btn btn-primary mt-4">Login</button>
          </fieldset>
        </form>
        <p className="text-sm">
          Don't have an account?{" "}
          <Link
            className="btn-link text-lime-600 font-light no-underline"
            to={"/register"}
            state={{ from }}
          >
            Register
          </Link>
        </p>
        <SocialLogin></SocialLogin>
      </div>
    </div>
  );
};

export default Login;
