"use client";

import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "@/channeling/widgets/checkout";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { SessionUser } from "@/types/users";
import { centsToLKR, lkrToCents } from "@/helpers/util/common";

export default function StepPayment({
  handleSetStep,
  date,
  appointmentId,
  user,
}: {
  handleSetStep: (num: -1 | 1) => void;
  date: string;
  appointmentId: string;
  user: SessionUser;
}) {
  const amount = lkrToCents(560); // 120LKR
  const currency = "lkr";
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
  );
  if (stripePromise === null) {
    throw new Error("Stripe promise is null");
  }
  return (
    <div className="flex flex-col min-h-[488px] items-center justify-center gap-10">
      <div>
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
            Your next step is to pay, {centsToLKR(amount)}LKR
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center ">
        <div className="bg-white/90 shadow-md rounded-lg border-2 border-black flex-none  p-4 flex justify-center gap-4">
          <div className="flex flex-col  justify-between items-center">
            <div>Date Selected: {date}</div>
            <div className="w-[300px] h-[200px]">
              <DotLottieReact
                src="/assets/images/payment.lottie"
                loop
                autoplay
              />
            </div>
          </div>

          <Elements
            stripe={stripePromise}
            options={{
              mode: "payment",
              currency: currency,
              amount: amount,
            }}
          >
            <CheckoutPage
              amount={amount}
              currency={currency}
              handleSetStep={handleSetStep}
              appointmentId={appointmentId}
              user={user}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
}
