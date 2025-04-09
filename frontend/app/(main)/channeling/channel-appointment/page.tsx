"use client";

import FirstStep from "@/channeling/ui/step-calendar";

import SecondStep from "@/channeling/ui/step-payment";
import Steps from "@/channeling/widgets/steps";
import ThirdStep from "@/channeling/ui/step-final-state";
import ZeroStep from "@/channeling/ui/step-personal-details";
import { usePatient } from "@/hooks/use-patient";
import { apiService } from "@/libs/api";
import { channelSchema } from "@/schemas/channel-schema";
import { AppointmentResponse } from "@/types/users";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function ChannelAppointment(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const searchParams = use(props.searchParams);

  const [stepsComplete, setStepsComplete] = useState(0);
  const { form, userId } = usePatient();
  const [date, setDate] = useState<Date | null>(null);
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
    <div className=" bg-white py-5 px-10 border-t-2 border-black border-dashed">
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
            <ZeroStep form={form} handleSubmit={handleSubmit} />
          )}

          {stepsComplete === 1 && (
            <FirstStep
              handleSetStep={handleSetStep}
              date={date}
              setDate={setDate}
              userId={userId}
            />
          )}

          {stepsComplete === 2 && (
            <SecondStep
              amount={amount}
              handleSetStep={handleSetStep}
              date={date ? date.toDateString() : ""}
            />
          )}

          {stepsComplete === 3 && (
            <ThirdStep
              reference={searchParams.ref as string}
              amount={amount}
              date={date ? date.toDateString() : ""}
              time={"4:00 PM"}
              no={"Session 2 - No 14"}
              name={`${form.getValues("firstName")} ${form.getValues("lastName")}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
