"use client";

import { Button } from "@/shadcn/ui/button";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { FaCreditCard } from "react-icons/fa";
import { toast } from "sonner";

export default function CheckoutPage({
  amount,
  handleSetStep,
}: {
  amount: number;
  handleSetStep: (num: -1 | 1) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSetStep(1);
    setLoading(true);
    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      toast.error(submitError.message);
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }
    const refId = "123456789"; // Replace with actual refId
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_FE_DOMAIN_NAME}/channeling/channel-appointment?amount=${amount}&step=3&ref=${refId}`,
      },
    });

    if (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    } else {
      toast.success("Payment successful!");
    }
    setLoading(false);
  };

  useEffect(() => {
    try {
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          currency: "usd",
        }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch(() => {
          toast.error("Failed to fetch client secret");
          setErrorMessage("Failed to fetch client secret");
        });
    } catch {
      toast.error("Failed to fetch client secret");
    }
  }, [amount]);

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }
  return (
    <form onSubmit={handleFormSubmit}>
      {clientSecret && <PaymentElement />}
      {errorMessage && (
        <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
      )}
      <Button className="mt-2 w-full text-base" disabled={!stripe || loading}>
        <FaCreditCard />
        {!loading ? `Pay ${amount}` : "Processing..."}
      </Button>
    </form>
  );
}
