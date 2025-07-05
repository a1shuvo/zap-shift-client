import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedRider, setSelectedRider] = useState(null);

  const { data: riders = [], isLoading } = useQuery({
    queryKey: ["pendingRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/pending");
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ id, status, email }) => {
      return axiosSecure.patch(`/riders/${id}`, { status, email });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingRiders"]);
    },
  });

  const handleAction = async (id, status, email) => {
    const confirm = await Swal.fire({
      title: `Are you sure to ${status} this rider?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (confirm.isConfirmed) {
      mutation.mutate({ id, status, email });
      Swal.fire({
        icon: "success",
        title: `Rider ${status === "accepted" ? "accepted" : "rejected"}`,
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  if (isLoading) return <p className="text-center py-10">Loading riders...</p>;

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Pending Riders</h2>

      {riders.length === 0 ? (
        <p className="text-center text-gray-500">No pending riders.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Region</th>
                <th>Warehouse</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider, index) => (
                <tr key={rider._id}>
                  <td>{index + 1}</td>
                  <td>{rider.name}</td>
                  <td>{rider.region}</td>
                  <td>{rider.warehouse}</td>
                  <td>{rider.email}</td>
                  <td>{rider.contact}</td>
                  <td className="flex gap-2 flex-wrap">
                    <button
                      className="btn btn-xs btn-info"
                      onClick={() => setSelectedRider(rider)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-xs btn-success"
                      onClick={() =>
                        handleAction(rider._id, "accepted", rider.email)
                      }
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() =>
                        handleAction(rider._id, "rejected", rider.email)
                      }
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Rider Details */}
      {selectedRider && (
        <dialog id="rider_modal" className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-xl mb-4">
              {selectedRider.name}'s Details
            </h3>
            <div className="space-y-2">
              <p>
                <strong>Email:</strong> {selectedRider.email}
              </p>
              <p>
                <strong>Region:</strong> {selectedRider.region}
              </p>
              <p>
                <strong>Warehouse:</strong> {selectedRider.warehouse}
              </p>
              <p>
                <strong>Contact:</strong> {selectedRider.contact}
              </p>
              <p>
                <strong>NID:</strong> {selectedRider.nid}
              </p>
              <p>
                <strong>Bike Brand:</strong> {selectedRider.bike_brand}
              </p>
              <p>
                <strong>Bike Reg No:</strong> {selectedRider.bike_reg_no}
              </p>
              <p>
                <strong>Age:</strong> {selectedRider.age}
              </p>
              <p>
                <strong>Status:</strong> {selectedRider.status}
              </p>
              <p>
                <strong>Applied At:</strong>{" "}
                {new Date(selectedRider.created_at).toLocaleString()}
              </p>
            </div>

            <div className="modal-action mt-4">
              <button
                onClick={() => setSelectedRider(null)}
                className="btn btn-sm"
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default PendingRiders;
