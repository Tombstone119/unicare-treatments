"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "@/components/layout/channeling/stripe/checkout";
import Image from "next/image";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { ArrowLeft } from "lucide-react";

export default function StripePayment({
  handleSetStep,
  amount,
}: {
  handleSetStep: (num: -1 | 1) => void;
  amount: number;
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
          <h1 className="text-2xl font-bold text-gray-800 text-center flex items-center gap-2 mb-1">
            Thank you for selecting
          </h1>
          <Image
            alt="logo"
            width={200}
            height={100}
            src="/assets/images/logo.svg"
            className="text-black mb-2 w-100"
          />
          <p className=" text-gray-800 text-center">
            Your next step is to pay, {amount}LKR
          </p>
          <div className="w-[300px] h-[200px]">
            <DotLottieReact src="/assets/images/payment.lottie" loop autoplay />
          </div>
          <button
            className="px-4 py-2 rounded bg-black text-white flex items-center gap-2 justify-center min-w-[292px]"
            onClick={() => {
              handleSetStep(-1);
            }}
          >
            <ArrowLeft className="h-5 w-5 text-white" />
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
