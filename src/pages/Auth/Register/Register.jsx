import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";
import SocialLogin from "../SocialLogin/SocialLogin";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { createUser, updateUserProfile } = useAuth();
  const [profilePic, setProfilePic] = useState("");

  const onSubmit = (data) => {
    console.log(data);

    createUser(data.email, data.password)
      .then((result) => {
        console.log(result);

        // save user data in the db

        // update user profile data in the firebase
        const userProfile = {
          displayName: data.name,
          photoURL: profilePic,
        };
        updateUserProfile(userProfile)
          .then(() => {
            console.log("User name & profile picture updated!");
          })
          .catch((err) => console.error(err));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    console.log(image);
    const formData = new FormData();
    formData.append("image", image);

    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_image_upload_key
    }`;
    const res = await axios.post(imageUploadUrl, formData);
    setProfilePic(res.data.data.url);
  };

  return (
    <div className="card bg-base-100 w-full">
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">
            <h1 className="text-3xl font-bold">Create an Account</h1>
            <p className="font-semibold">Register with Profast</p>

            {/* Name field */}
            <label className="label">Your Name</label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="input"
              placeholder="Your Name"
            />
            {errors.email?.type === "required" && (
              <p className="text-red-500">Name is required!</p>
            )}

            {/* Profile picture field */}
            <label className="label">Profile Picture</label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="file-input"
              placeholder="Your Profile Picture"
            />
            {errors.email?.type === "required" && (
              <p className="text-red-500">Name is required!</p>
            )}

            {/* Email field */}
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

            {/* Password field */}
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
            <button className="btn btn-primary mt-4">Register</button>
          </fieldset>
        </form>
        <p className="text-sm">
          Already have an account?{" "}
          <Link
            className="btn-link text-lime-600 font-light no-underline"
            to={"/login"}
          >
            Login
          </Link>
        </p>
        <SocialLogin></SocialLogin>
      </div>
    </div>
  );
};

export default Register;
