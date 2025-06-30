import { useQuery } from "@tanstack/react-query";
import { FaCreditCard, FaEye, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

// 🔹 Utility: Format Date
const formatDateTime = (isoDate) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return new Date(isoDate).toLocaleString("en-US", options);
};

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { data: parcels = [], refetch } = useQuery({
    queryKey: ["my-parcels", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });

  // 🔹 Action: View Parcel
  const handleView = (parcel) => {
    console.log("Viewing Parcel:", parcel);
    // Optionally open modal or navigate
  };

  // 🔹 Action: Pay for Parcel
  const handlePay = (id) => {
    console.log("Paying for Parcel:", id);
    navigate(`/dashboard/payment/${id}`);
  };

  // 🔹 Action: Delete Parcel
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Your Parcel will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/parcels/${id}`);
        if (res.data?.deletedCount > 0) {
          Swal.fire({
            title: "Deleted",
            text: "Your parcel has been deleted!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          refetch();
        } else {
          Swal.fire("Failed", "Parcel not found or already deleted.", "error");
        }
      } catch (error) {
        Swal.fire(
          "Error",
          error?.response?.data?.message || "Something went wrong.",
          "error"
        );
      }
    }
  };

  // Status Color
  const getStatusColor = (status, type) => {
    const map = {
      delivery_status: {
        delivered: "badge-success",
        in_transit: "badge-info",
        not_collected: "badge-warning",
        cancelled: "badge-error",
      },
      payment_status: {
        paid: "badge-success",
        unpaid: "badge-error",
        pending: "badge-warning",
      },
    };
    return map[type][status] || "badge-ghost";
  };

  return (
    <div className="overflow-x-auto p-4 w-full">
      <h2 className="text-xl font-semibold mb-4 text-center">Parcel List</h2>

      {parcels.length === 0 ? (
        <div className="text-center text-lg text-gray-500 py-10">
          <p>No parcels found.</p>
        </div>
      ) : (
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-sm">
            <tr>
              <th>#</th>
              <th>Type</th>
              <th>Title</th>
              <th>Tracking ID</th>
              <th>Created At</th>
              <th>Delivery Status</th>
              <th>Payment</th>
              <th>Cost (৳)</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <td>{index + 1}</td>
                <td className="capitalize">{parcel.type}</td>
                <td>{parcel.title}</td>
                <td className="font-mono text-sm">{parcel.tracking_id}</td>
                <td>{formatDateTime(parcel.creation_date)}</td>
                <td>
                  <span
                    className={`badge ${getStatusColor(
                      parcel.delivery_status,
                      "delivery_status"
                    )} badge-sm capitalize`}
                  >
                    {parcel.delivery_status.replace("_", " ")}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${getStatusColor(
                      parcel.payment_status,
                      "payment_status"
                    )} badge-sm capitalize`}
                  >
                    {parcel.payment_status}
                  </span>
                </td>
                <td>৳{parcel.deliveryCost}</td>
                <td className="flex gap-2 justify-center flex-wrap">
                  <button
                    onClick={() => handleView(parcel)}
                    className="btn btn-xs btn-outline btn-info"
                  >
                    <FaEye />
                    View
                  </button>
                  {parcel.payment_status === "unpaid" && (
                    <button
                      onClick={() => handlePay(parcel._id)}
                      className="btn btn-xs btn-outline btn-success"
                    >
                      <FaCreditCard />
                      Pay
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(parcel._id)}
                    className="btn btn-xs btn-outline btn-error"
                  >
                    <FaTrashAlt />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyParcels;
