import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router";
import Swal from "sweetalert2";
import Rider from "../../assets/agent-pending.png";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const BeRider = () => {
  const warehouses = useLoaderData();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
    },
  });

  const selectedRegion = watch("region");

  const getUniqueRegions = () => {
    return [...new Set(warehouses.map((w) => w.region))].sort();
  };

  const getWarehousesByRegion = (region) => {
    return warehouses.filter((w) => w.region === region);
  };

  const onSubmit = async (data) => {
    const riderData = {
      ...data,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    try {
      console.log(riderData);
      const res = await axiosSecure.post("/riders", riderData);

      if (res.data?.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Application Submitted!",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="my-4 p-4 bg-base-100 rounded-2xl max-w-7xl mx-auto">
      {/* Header */}
      <div className="lg:text-left text-center mb-6">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">Be a Rider</h1>
        <p className="text-gray-600 max-w-2xl">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero
          hassle. From personal packages to business shipments — we deliver on
          time, every time.
        </p>
      </div>

      {/* Divider */}
      <div className="border-b-2 border-gray-200 my-6"></div>

      {/* Form & Image Section */}
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        {/* Left Side - Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 lg:text-left text-center">
            Tell us about yourself
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name & Age */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text">Your Name</span>
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  placeholder="Enter your full name"
                  className="input input-bordered w-full"
                  readOnly
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Your Age</span>
                </label>
                <input
                  type="number"
                  {...register("age", {
                    required: "Age is required",
                    min: { value: 18, message: "Minimum age is 18" },
                  })}
                  placeholder="e.g. 25"
                  className="input input-bordered w-full"
                />
                {errors.age && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.age.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email & Region */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text">Your Email</span>
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email format",
                    },
                  })}
                  placeholder="example@email.com"
                  className="input input-bordered w-full"
                  readOnly
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Your Region</span>
                </label>
                <select
                  {...register("region", { required: "Region is required" })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select your region</option>
                  {getUniqueRegions().map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                {errors.region && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.region.message}
                  </p>
                )}
              </div>
            </div>

            {/* NID & Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text">NID No</span>
                </label>
                <input
                  type="text"
                  {...register("nid", { required: "NID number is required" })}
                  placeholder="Your NID Number"
                  className="input input-bordered w-full"
                />
                {errors.nid && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.nid.message}
                  </p>
                )}
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Contact</span>
                </label>
                <input
                  type="text"
                  {...register("contact", {
                    required: "Contact number is required",
                    pattern: {
                      value: /^01[3-9]\d{8}$/,
                      message: "Invalid phone number",
                    },
                  })}
                  placeholder="01XXXXXXXXX"
                  className="input input-bordered w-full"
                />
                {errors.contact && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.contact.message}
                  </p>
                )}
              </div>
            </div>

            {/* Bike Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text">Bike Brand</span>
                </label>
                <input
                  type="text"
                  {...register("bike_brand", {
                    required: "Bike brand is required",
                  })}
                  placeholder="Honda, Bajaj, etc."
                  className="input input-bordered w-full"
                />
                {errors.bike_brand && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.bike_brand.message}
                  </p>
                )}
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Bike Registration No</span>
                </label>
                <input
                  type="text"
                  {...register("bike_reg_no", {
                    required: "Registration number is required",
                  })}
                  placeholder="Dhaka Metro-XY-123456"
                  className="input input-bordered w-full"
                />
                {errors.bike_reg_no && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.bike_reg_no.message}
                  </p>
                )}
              </div>
            </div>

            {/* Warehouse Select */}
            <div>
              <label className="label">
                <span className="label-text">Preferred Warehouse</span>
              </label>
              <select
                {...register("warehouse", {
                  required: "Warehouse selection is required",
                })}
                className="select select-bordered w-full"
                disabled={!selectedRegion}
              >
                <option value="">Select a warehouse</option>
                {selectedRegion &&
                  getWarehousesByRegion(selectedRegion).map((w, i) => (
                    <option key={i} value={w.city}>
                      {w.city}
                    </option>
                  ))}
              </select>
              {errors.warehouse && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.warehouse.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="text-center lg:text-left">
              <button type="submit" className="btn btn-primary w-full">
                Submit
              </button>
            </div>
          </form>
        </div>

        {/* Right Side - Image */}
        <div className="flex justify-center lg:justify-end">
          <img
            src={Rider}
            alt="Rider Illustration"
            className="w-full max-w-md object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default BeRider;
