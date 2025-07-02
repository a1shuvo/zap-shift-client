import { useQuery } from "@tanstack/react-query";
import { MdPayment } from "react-icons/md";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { isPending, data: payments = [] } = useQuery({
    queryKey: ["payments", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    },
  });

  if (isPending) {
    return "Loading...";
  }
  console.log(payments);

  if (payments.length === 0) {
    return (
      <div className="text-center py-10">
        <MdPayment className="mx-auto text-5xl text-gray-400" />
        <p className="text-gray-500 mt-2">No payment history available.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow border border-base-200">
      <table className="table table-zebra w-full">
        <thead className="bg-base-200 text-base-content">
          <tr>
            <th>#</th>
            <th>Parcel ID</th>
            <th>Amount (৳)</th>
            <th>Transaction ID</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={payment.transactionId || index}>
              <th>{index + 1}</th>
              <td className="font-mono">{payment.parcelId}</td>
              <td className="text-green-600 font-semibold">
                ৳{payment.amount}
              </td>
              <td className="font-mono text-xs break-words">
                {payment.transactionId}
              </td>
              <td>{new Date(payment.paid_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
