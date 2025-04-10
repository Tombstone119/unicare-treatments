import StripePayment from "@/channeling/widgets/channel-payment";
import Image from "next/image";

export default function PaymentStep({
  handleSetStep,
  amount,
  date,
  appointmentId,
}: {
  handleSetStep: (num: -1 | 1) => void;
  amount: number;
  date: string;
  appointmentId: string;
}) {
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
            Your next step is to pay, {amount}LKR
          </p>
        </div>
      </div>
      <StripePayment
        handleSetStep={handleSetStep}
        amount={amount}
        date={date}
        appointmentId={appointmentId}
      />
    </div>
  );
}
