"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "@/channeling/widgets/checkout";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { ArrowLeft } from "lucide-react";

export default function StripePayment({
  handleSetStep,
  amount,
  date,
}: {
  handleSetStep: (num: -1 | 1) => void;
  amount: number;
  date: string;
}) {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
  );
  if (stripePromise === null) {
    throw new Error("Stripe promise is null");
  }
  return (
    <div className="flex justify-center items-center ">
      <div className="bg-white/90 shadow-md rounded-lg border-2 border-black flex-none  p-4 flex justify-center gap-4">
        <div className="flex flex-col  justify-between items-center">
          <div>Date Selected: {date}</div>
          <div className="w-[300px] h-[200px]">
            <DotLottieReact src="/assets/images/payment.lottie" loop autoplay />
          </div>
          <button
            className="px-4 py-2 rounded border-2 border-black text-black flex items-center gap-2 justify-center min-w-[196px]"
            onClick={() => {
              handleSetStep(-1);
            }}
          >
            <ArrowLeft className="h-5 w-5 text-black" />
            Go Back
          </button>
        </div>

        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            currency: "usd",
            amount: amount,
          }}
        >
          <CheckoutPage amount={amount} handleSetStep={handleSetStep} />
        </Elements>
      </div>
    </div>
  );
}
