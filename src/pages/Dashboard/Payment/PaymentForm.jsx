import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../shared/Loader/Loader";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { parcelId } = useParams();
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const { isPending, data: parcelInfo = {} } = useQuery({
    queryKey: ["parcel", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      return res.data;
    },
  });

  if (isPending) {
    return <Loader></Loader>;
  }
  const amount = parcelInfo.deliveryCost;
  const amountInCents = amount * 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (!card) {
      return;
    }

    // Step-1: Validate the card
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message);
    } else {
      setError("");
      console.log("[PaymentMethod]", paymentMethod);

      // Step-2: Create payment intent
      const res = await axiosSecure.post("/create-payment-intent", {
        amountInCents,
        parcelId,
      });

      const clientSecret = res.data?.clientSecret;

      // Step-3: Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.displayName,
            email: user.email,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        setError("");
        if (result.paymentIntent.status === "succeeded") {
          const transactionId = result.paymentIntent.id;

          // Step-4: Mark parcel paid and create payment history
          const paymentData = {
            parcelId,
            email: user.email,
            amount,
            paymentMethod: result.paymentIntent.payment_method_types,
            transactionId,
          };
          const paymentRes = await axiosSecure.post("/payments", paymentData);
          if (paymentRes.data?.insertedId) {
            // Show Sweet alert with transaction ID
            await Swal.fire({
              icon: "success",
              title: "Payment Successful!",
              html: `<strong>Transaction ID:</strong> <code>${transactionId}</code>`,
              confirmButtonText: "Go to My Parcels",
            });

            // Redirect to My Parcels
            navigate("/dashboard/myParcels");
          }
        }
      }
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
