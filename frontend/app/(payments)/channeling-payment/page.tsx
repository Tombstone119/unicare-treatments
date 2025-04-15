"use client";

import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "@/channeling/widgets/checkout";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { IUser } from "@/types/users";
import { centsToLKR } from "@/helpers/util/common";
import { use } from "react";

const session = ["Session 1", "Session 2", "Session 3"];

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function Page(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const searchParams = use(props.searchParams);
  const amount = +(searchParams?.amount || 560);
  const appointmentId = searchParams?.appointmentId as string;
  const date = searchParams?.date as string;
  const currency = "lkr";
  const appointmentDetails = {
    session: +(searchParams?.session || 1),
    start: searchParams?.start as string,
    end: searchParams?.end as string,
  };
  const userDetails = {} as IUser;
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
            <div>
              <div>
                <b>Patient: </b>
                {userDetails?.firstName} {userDetails?.lastName}
              </div>
              <div>
                <b>Date: </b>
                {date}
              </div>
              <div>
                <b>Time Slot: </b>
                {appointmentDetails.session === 1
                  ? session[0]
                  : appointmentDetails.session === 2
                    ? session[1]
                    : session[2]}{" "}
                {"("}
                {appointmentDetails.start} {"-"} {appointmentDetails.end}
                {")"}
              </div>
              <div></div>
            </div>
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
              // paymentMethodTypes: ["card"],
            }}
          >
            <CheckoutPage
              amount={amount}
              currency={currency}
              appointmentId={appointmentId}
              userDetails={userDetails}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
}
