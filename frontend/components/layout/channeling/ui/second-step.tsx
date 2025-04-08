import StripePayment from "@/channeling/widgets/channel-payment";

export default function SecondStep({
  handleSetStep,
  amount,
}: {
  handleSetStep: (num: -1 | 1) => void;
  amount: number;
}) {
  return (
    <div className="flex flex-col min-h-[488px] items-center justify-center gap-10">
      <div className="text-2xl font-bold text-gray-800 text-center flex flex-col items-center gap-2">
        Make your Payment
      </div>
      <StripePayment handleSetStep={handleSetStep} amount={amount} />
    </div>
  );
}
