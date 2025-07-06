import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [searchText, setSearchText] = useState("");

  // Fetch Active Riders
  const { data: riders = [], isLoading } = useQuery({
    queryKey: ["activeRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/active");
      return res.data;
    },
  });

  // Mutation: Deactivate rider
  const mutation = useMutation({
    mutationFn: async (id) => {
      return axiosSecure.patch(`/riders/${id}`, { status: "deactivated" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["activeRiders"]);
      Swal.fire({
        icon: "success",
        title: "Rider Deactivated",
        timer: 1500,
        showConfirmButton: false,
      });
    },
  });

  const handleDeactivate = async (rider) => {
    const confirm = await Swal.fire({
      title: `Deactivate ${rider.name}?`,
      text: "This rider will no longer be active.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deactivate",
    });

    if (confirm.isConfirmed) {
      mutation.mutate(rider._id);
    }
  };

  const filteredRiders = riders.filter((rider) => {
    const query = searchText.toLowerCase();
    return (
      rider.name.toLowerCase().includes(query) ||
      rider.contact.toLowerCase().includes(query)
    );
  });

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Active Riders</h2>

      {/* Search */}
      <div className="max-w-sm mx-auto mb-4">
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Search by name or contact..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {isLoading ? (
        <p className="text-center">Loading riders...</p>
      ) : filteredRiders.length === 0 ? (
        <p className="text-center text-gray-500">No active riders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Region</th>
                <th>Warehouse</th>
                <th>Phone</th>
                <th>Bike</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRiders.map((rider, index) => (
                <tr key={rider._id}>
                  <td>{index + 1}</td>
                  <td>{rider.name}</td>
                  <td>{rider.region}</td>
                  <td>{rider.warehouse}</td>
                  <td>{rider.contact}</td>
                  <td>{rider.bike_brand}</td>
                  <td>
                    <button
                      className="btn btn-xs btn-warning"
                      onClick={() => handleDeactivate(rider)}
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ActiveRiders;
