import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageAdmins = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchEmail, setSearchEmail] = useState("");

  // Search users based on input email (no debounce)
  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["searchedUsers", searchEmail],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/search?email=${searchEmail}`);
      return res.data;
    },
    enabled: !!searchEmail, // only fetch if email is not empty
    retry: false,
  });

  // Mutation: Change role to admin or user
  const mutation = useMutation({
    mutationFn: async ({ id, role }) => {
      return axiosSecure.patch(`/users/${id}/role`, { role });
    },
    onSuccess: (_, { role }) => {
      queryClient.invalidateQueries(["searchedUsers"]);
      Swal.fire({
        icon: "success",
        title: `User role changed to ${role}`,
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onError: () => {
      Swal.fire("Failed to update role", "", "error");
    },
  });

  const handleRoleChange = (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    mutation.mutate({ id, role: newRole });
  };

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Manage Admin Role</h2>
      <div className="max-w-sm mx-auto mb-4">
        <input
          type="text"
          placeholder="Search user by email..."
          className="input input-bordered w-full"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading...</p>}
      {isError && <p className="text-sm text-red-500">Something went wrong!</p>}

      {!isLoading && users.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        user.role === "admin" ? "badge-success" : "badge-ghost"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.created_at).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => handleRoleChange(user._id, user.role)}
                      className={`btn btn-xs ${
                        user.role === "admin" ? "btn-error" : "btn-success"
                      }`}
                      disabled={mutation.isPending}
                    >
                      {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && users.length === 0 && searchEmail && (
        <p className="text-center text-gray-500">No users found.</p>
      )}
    </div>
  );
};

export default ManageAdmins;
