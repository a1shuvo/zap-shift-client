import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const generateTrackingID = () => {
  const date = new Date();
  const datePart = date.toISOString().split("T")[0].replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `PCL-${datePart}-${rand}`;
};

const SendParcel = () => {
  const warehouses = useLoaderData();
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
    let baseCost = 0;
    let extraCost = 0;
    let breakdown = "";
    let parcelType = type;
    let deliveryZone = isSameCity ? "Within Same District" : "Outside District";

    if (type === "document") {
      baseCost = isSameCity ? 60 : 80;
      breakdown = `Document delivery ${
        isSameCity ? "within" : "outside"
      } the district.`;
    } else if (type === "non-document") {
      if (parsedWeight <= 3) {
        baseCost = isSameCity ? 110 : 150;
        breakdown = `Non-document up to 3kg ${
          isSameCity ? "within" : "outside"
        } the district.`;
      } else {
        const extraKg = parsedWeight - 3;
        const perKgCharge = extraKg * 40;
        const districtExtra = isSameCity ? 0 : 40;
        baseCost = isSameCity ? 110 : 150;
        extraCost = perKgCharge + districtExtra;

        breakdown = `
        Non-document over 3kg ${
          isSameCity ? "within" : "outside"
        } the district.<br/>
        Extra charge: ৳40 x ${extraKg.toFixed(1)}kg = ৳${perKgCharge}<br/>
        ${districtExtra ? "+ ৳40 extra for outside district delivery" : ""}
      `;
      }
    }

    const totalCost = baseCost + extraCost;

    return {
      parcelType,
      weight: parsedWeight,
      deliveryZone,
      baseCost,
      extraCost,
      totalCost,
      breakdown,
    };
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const {
      parcelType,
      weight,
      deliveryZone,
      baseCost,
      extraCost,
      totalCost,
      breakdown,
    } = calculateCost();

    const result = await Swal.fire({
      title: "📦 Delivery Cost Breakdown",
      icon: "info",
      html: `
      <div class="text-left text-base space-y-2">
        <p><strong>Parcel Type:</strong> ${parcelType}</p>
        <p><strong>Weight:</strong> ${weight} kg</p>
        <p><strong>Delivery Zone:</strong> ${deliveryZone}</p>
        <hr class="my-2"/>
        <p><strong>Base Cost:</strong> ৳${baseCost}</p>
        ${
          extraCost > 0
            ? `<p><strong>Extra Charges:</strong> ৳${extraCost}</p>`
            : ""
        }
        <div class="text-gray-500 text-sm">${breakdown}</div>
        <hr class="my-2"/>
        <p class="text-xl font-bold text-green-600">Total Cost: ৳${totalCost}</p>
      </div>
    `,
      showDenyButton: true,
      confirmButtonText: "💳 Proceed to Payment",
      denyButtonText: "✏️ Continue Editing",
      confirmButtonColor: "#16a34a",
      denyButtonColor: "#d3d3d3",
      customClass: {
        popup: "rounded-xl shadow-md px-6 py-6",
      },
    });

    if (result.isConfirmed) {
      const parcelData = {
        ...data,
        deliveryCost: totalCost,
        created_by: user.email,
        payment_status: "unpaid",
        delivery_status: "not_collected",
        creation_date: new Date().toISOString(),
        tracking_id: generateTrackingID(),
      };

      console.log("Confirmed Parcel:", parcelData);

      // axiosSecure.post("/parcels", parcelData).then((res) => {
      //   if (res.data.insertedId) {
      //     Swal.fire({
      //       title: "Redirecting...",
      //       text: "Proceeding to payment gateway.",
      //       icon: "success",
      //       timer: 1500,
      //       showConfirmButton: false,
      //     });
      //   }
      // });
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
                placeholder="Describe your parcel"
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
          <div className="bg-lime-50 border border-lime-300 text-lime-900 px-5 py-3 rounded-md shadow-sm text-sm mt-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">💰</span>
              <span>
                <span className="font-medium">Estimated Delivery Cost:</span>{" "}
                <span className="font-bold text-green-600">
                  ৳{calculateCost().totalCost}
                </span>
              </span>
            </div>
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
