"use client";
import ChannelAppointmentForm from "@/components/layout/channeling/forms/ChannelAppointmentForm";
import StripePayment from "@/components/layout/channeling/widgets/channel-payment";
import { FlipCalendar } from "@/components/layout/channeling/widgets/flip-calendar";
import Steps from "@/components/layout/channeling/widgets/steps";
import { usePatient } from "@/hooks/use-patient";
import { apiService } from "@/libs/api";
import { channelSchema } from "@/schemas/channel-schema";
import { AppointmentResponse } from "@/types/users";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { toast } from "sonner";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function ChannelAppointment(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  // const params = use(props.params);
  const searchParams = use(props.searchParams);
  // const slug = params.slug;
  // const query = searchParams.query;

  console.log("params: =-->", searchParams);

  const [stepsComplete, setStepsComplete] = useState(0);
  const { form, userId } = usePatient();
  const [date, setDate] = useState(new Date());
  const numSteps = 3;
  const amount = 500; // 20 => 0.20 cents

  useEffect(() => {
    if (searchParams?.step) {
      const step = Number(searchParams.step);
      if (step >= 0 && step <= numSteps) {
        setStepsComplete(step);
      } else {
        setStepsComplete(0);
      }
    }
  }, [searchParams]);

  const handleSetStep = (num: -1 | 1) => {
    if (
      (stepsComplete === 0 && num === -1) ||
      (stepsComplete === numSteps && num === 1)
    ) {
      return;
    }

    setStepsComplete((pv) => pv + num);
  };

  const handleSubmit = async (values: channelSchema) => {
    try {
      if (userId) {
        const response = await apiService.put<AppointmentResponse>(
          `/user/${userId}`,
          { ...values }
        );
        if (response.success) {
          // toast.success(
          //   `Appointment successfully created!. Ref:${response.appointment?._id}`
          // );
          handleSetStep(1);
        } else {
          toast.error("Something went wrong, try again");
        }
      } else {
        toast.error("Something went wrong, try again");
      }
    } catch {
      toast.error("Something went wrong, try again");
    }
  };

  return (
    <div className=" bg-white py-5 px-10">
      <div className="flex items-center justify-between mb-5">
        <Link href="/channeling" className="flex items-center gap-2">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
          Appointment Center
        </Link>
      </div>

      <Steps numSteps={numSteps} stepsComplete={stepsComplete} />
      <div className="py-8 pb-10 px-4 my-4 bg-gray-100 border-2 border-dashed border-black rounded-lg">
        <div className="flex flex-col gap-4 justify-center items-center">
          {stepsComplete === 0 && (
            <ChannelAppointmentForm form={form} handleSubmit={handleSubmit} />
          )}

          {stepsComplete === 1 && (
            <div className="flex flex-col min-h-[488px] items-center justify-center gap-10">
              <h1 className="text-2xl font-bold text-gray-800 text-center">
                Select a Date
              </h1>
              <FlipCalendar date={date} setDate={setDate} />
              <div className="flex items-center gap-5">
                <button
                  className="px-4 py-2 rounded bg-black text-white flex items-center gap-2 justify-center min-w-[196px]"
                  onClick={() => {
                    handleSetStep(-1);
                  }}
                >
                  <ArrowLeft className="h-5 w-5 text-white" />
                  Go Back
                </button>
                <button
                  className="px-4 py-2 rounded bg-black text-white flex items-center gap-2 justify-center"
                  onClick={() => {
                    handleSetStep(1);
                  }}
                >
                  <FaCalendarAlt />
                  Save and Continue
                </button>
              </div>
            </div>
          )}

          {stepsComplete === 2 && (
            <div className="flex flex-col min-h-[488px] items-center justify-center gap-10">
              <div className="text-2xl font-bold text-gray-800 text-center flex flex-col items-center gap-2">
                Make your Payment
              </div>
              <StripePayment handleSetStep={handleSetStep} amount={amount} />
            </div>
          )}

          {stepsComplete === 3 && (
            <div className="flex flex-col min-h-[488px] items-center justify-center gap-10">
              <div className="text-2xl font-bold text-gray-800 text-center flex flex-col items-center gap-2">
                Your Payment {`LKR ${searchParams?.amount}`} is Successfully
                Received
              </div>
              <Link
                href={"/channeling/view-my-appointments"}
                className="bg-black text-white px-5 py-2 rounded-md"
              >
                Go Back to Appointments
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
