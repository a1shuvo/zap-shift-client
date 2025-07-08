import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();

  const { data: parcels = [], isLoading, isError } = useQuery({
    queryKey: ["assignableParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        "/parcels?payment_status=paid&delivery_status=not_collected"
      );
      return res.data;
    },
  });

  // Sort by creation_date ascending (oldest first)
  const sortedParcels = [...parcels].sort(
    (a, b) => new Date(a.creation_date) - new Date(b.creation_date)
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (isError || sortedParcels.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-10">
        No unassigned parcels available.
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">
        Assign Rider to Parcels
      </h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full text-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Parcel ID</th>
              <th>Title</th>
              <th>Type</th>
              <th>Sender Center</th>
              <th>Receiver Center</th>
              <th>Cost</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedParcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <td>{index + 1}</td>
                <td>{parcel.tracking_id}</td>
                <td>{parcel.title}</td>
                <td>{parcel.type}</td>
                <td>{parcel.senderWarehouse}</td>
                <td>{parcel.receiverWarehouse}</td>
                <td>৳{parcel.deliveryCost}</td>
                <td>{new Date(parcel.creation_date).toLocaleString()}</td>
                <td>
                  <button className="btn btn-sm btn-primary">
                    Assign Rider
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignRider;
