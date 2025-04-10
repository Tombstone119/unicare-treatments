import Link from "next/link";
import AppointmentCard from "@/components/layout/channeling/ui/appointment-card";

export default function SuccessStep({
  reference,
  amount,
  date,
  time,
  no,
  name,
}: {
  reference: string;
  amount: number;
  date: string;
  time: string;
  no: string;
  name: string;
}) {
  return (
    <div className="flex flex-col min-h-[488px] items-center justify-center gap-10">
      <div className="flex flex-col gap-2 items-center">
        <div className="text-2xl font-bold text-gray-800 text-center">
          Thank you for your payment!
        </div>
        <p>Your appointment details are available here.</p>
      </div>
      <AppointmentCard
        reference={reference}
        amount={amount}
        date={date}
        time={time}
        no={no}
        name={name}
      />
      <Link
        href={"/channeling"}
        className="bg-black text-white px-5 py-2 rounded-md"
      >
        Go Back to Appointments
      </Link>
    </div>
  );
}
