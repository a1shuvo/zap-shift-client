import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { parcelId } = useParams();

  const [error, setError] = useState("");

  const { isPending, data: parcelInfo = {} } = useQuery({
    queryKey: ["parcel", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      return res.data;
    },
  });

  if (isPending) {
    return "Loading...";
  }
  console.log(parcelInfo);
  const amount = parcelInfo.deliveryCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (!card) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message);
    } else {
      setError("");
      console.log("[PaymentMethod]", paymentMethod);
    }
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="max-w-md p-6 bg-white shadow-md rounded-xl space-y-4 w-full mx-auto"
      >
        <CardElement className="p-2 border rounded"></CardElement>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={!stripe}
        >
          Pay ${amount}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
