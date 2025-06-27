import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const SendParcel = () => {
  const warehouses = useLoaderData();

  // Simulated logged-in user (replace with AuthContext later)
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  const watchFields = watch();
  const { type, weight = 0, senderRegion, receiverRegion } = watchFields;

  const parsedWeight = parseFloat(weight) || 0;
  const isSameCity = senderRegion === receiverRegion;

  const getUniqueRegions = () => {
    return [...new Set(warehouses.map((w) => w.region))].sort();
  };

  const getWarehousesByRegion = (region) => {
    return warehouses.filter((w) => w.region === region);
  };

  const calculateCost = () => {
    let cost = 0;
    let breakdown = "";

    if (type === "document") {
      cost = isSameCity ? 60 : 80;
      breakdown = `Document Parcel\nBase Rate: ৳${cost}`;
    } else if (type === "non-document") {
      if (parsedWeight <= 3) {
        cost = isSameCity ? 110 : 150;
        breakdown = `Non-Document ≤3kg\nBase Rate: ৳${cost}`;
      } else {
        const extraKg = parsedWeight - 3;
        const extraCost = extraKg * 40;
        cost = (isSameCity ? 110 : 150) + extraCost + (!isSameCity ? 40 : 0);
        breakdown = `Non-Document >3kg\nBase: ৳${
          isSameCity ? 110 : 150
        } + ৳40/kg x ${extraKg}${
          !isSameCity ? " + ৳40 (Outside)" : ""
        }\nTotal: ৳${cost}`;
      }
    }

    return { cost, breakdown };
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const { cost, breakdown } = calculateCost();

    const result = await Swal.fire({
      title: `Estimated Cost: ৳${cost}`,
      html: `<pre style="text-align:left;font-size:14px;">${breakdown}</pre>`,
      showDenyButton: true,
      confirmButtonText: "Confirm Delivery",
      confirmTextColor: "#000",
      denyButtonText: "Continue Editing",
      confirmButtonColor: "#B7D55C",
      icon: "info",
    });

    if (result.isConfirmed) {
      const parcelData = {
        ...data,
        creation_date: new Date().toISOString(),
        deliveryCost: cost,
      };

      // TODO: Send to backend
      console.log("Confirmed Parcel:", parcelData);

      Swal.fire({
        icon: "success",
        title: "Your parcel has been booked!",
        showConfirmButton: false,
        timer: 1500,
      });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-base-100 shadow rounded-lg my-10">
      <h2 className="text-2xl font-bold mb-1">Add Parcel</h2>
      <hr className="my-2 border-gray-300" />
      <p className="mb-6 text-gray-600">Enter your parcel details</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* === Parcel Info === */}
        <fieldset className="space-y-4">
          <legend className="font-semibold text-lg">Parcel Info</legend>

          <div className="flex gap-6 items-center">
            <label className="label-text">Type:</label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="document"
                {...register("type", { required: true })}
                className="radio"
              />
              Document
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="non-document"
                {...register("type", { required: true })}
                className="radio"
              />
              Non-Document
            </label>
            {errors.type && (
              <p className="text-red-500 text-sm">Parcel type is required</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Parcel Name</label>
              <input
                {...register("title", { required: "Parcel name is required" })}
                placeholder="Parcel Name"
                className="input input-bordered w-full"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="label">Parcel Weight (KG)</label>
              <input
                type="number"
                step="0.1"
                {...register("weight", {
                  validate: () => type === "document" || parsedWeight > 0,
                })}
                placeholder="Parcel Weight (KG)"
                className="input input-bordered w-full"
                disabled={type === "document"}
              />
              {type === "non-document" && parsedWeight <= 0 && (
                <p className="text-red-500 text-sm">
                  Weight must be greater than 0
                </p>
              )}
            </div>
          </div>
        </fieldset>

        {/* === Real-time Delivery Cost Preview === */}
        {type && senderRegion && receiverRegion && (
          <div className="bg-lime-100 text-primary-content px-4 py-2 rounded text-sm">
            💰 Estimated Cost: <strong>৳{calculateCost().cost}</strong>
          </div>
        )}

        <hr className="border-gray-300" />

        <div className="grid md:grid-cols-2 gap-8">
          {/* === Sender Details === */}
          <fieldset className="space-y-4 border border-gray-200 p-4 rounded-md">
            <legend className="font-semibold text-lg">Sender Details</legend>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                defaultValue={user?.displayName}
                {...register("senderName", { required: true })}
                placeholder="Sender Name"
                className="input input-bordered"
              />

              <select
                {...register("senderWarehouse", { required: true })}
                className="select select-bordered"
                disabled={!senderRegion}
              >
                <option value="">Select Pickup Warehouse</option>
                {getWarehousesByRegion(senderRegion).map((w, i) => (
                  <option key={i} value={w.city}>
                    {w.city}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                {...register("senderAddress", { required: true })}
                placeholder="Address"
                className="input input-bordered"
              />
              <input
                {...register("senderContact", {
                  required: true,
                  pattern: {
                    value: /^01[3-9]\d{8}$/,
                    message: "Invalid phone number",
                  },
                })}
                placeholder="Sender Contact No"
                className="input input-bordered"
              />
              {errors.senderContact && (
                <p className="text-red-500 text-sm">
                  {errors.senderContact.message}
                </p>
              )}
            </div>

            <select
              {...register("senderRegion", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">Your Region</option>
              {getUniqueRegions().map((region, idx) => (
                <option key={idx} value={region}>
                  {region}
                </option>
              ))}
            </select>

            <textarea
              {...register("pickupInstruction", { required: true })}
              placeholder="Pickup Instruction"
              className="textarea textarea-bordered w-full"
            />
          </fieldset>

          {/* === Receiver Details === */}
          <fieldset className="space-y-4 border border-gray-200 p-4 rounded-md">
            <legend className="font-semibold text-lg">Receiver Details</legend>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                {...register("receiverName", { required: true })}
                placeholder="Receiver Name"
                className="input input-bordered"
              />

              <select
                {...register("receiverWarehouse", { required: true })}
                className="select select-bordered"
                disabled={!receiverRegion}
              >
                <option value="">Select Delivery Warehouse</option>
                {getWarehousesByRegion(receiverRegion).map((w, i) => (
                  <option key={i} value={w.city}>
                    {w.city}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                {...register("receiverAddress", { required: true })}
                placeholder="Receiver Address"
                className="input input-bordered"
              />
              <input
                {...register("receiverContact", {
                  required: true,
                  pattern: {
                    value: /^01[3-9]\d{8}$/,
                    message: "Invalid phone number",
                  },
                })}
                placeholder="Receiver Contact No"
                className="input input-bordered"
              />
              {errors.receiverContact && (
                <p className="text-red-500 text-sm">
                  {errors.receiverContact.message}
                </p>
              )}
            </div>

            <select
              {...register("receiverRegion", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">Receiver Region</option>
              {getUniqueRegions().map((region, idx) => (
                <option key={idx} value={region}>
                  {region}
                </option>
              ))}
            </select>

            <textarea
              {...register("deliveryInstruction", { required: true })}
              placeholder="Delivery Instruction"
              className="textarea textarea-bordered w-full"
            />
          </fieldset>
        </div>

        <p className="text-sm mt-4 text-gray-600">
          PickUp Time: <strong>4pm-7pm</strong> Approx.
        </p>

        <button className="btn btn-primary mt-6" disabled={loading}>
          {loading ? "Processing..." : "Proceed to Confirm Booking"}
        </button>
      </form>
    </div>
  );
};

export default SendParcel;
