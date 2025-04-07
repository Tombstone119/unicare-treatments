"use client";
import ChannelAppointmentForm from "@/components/layout/channeling/forms/ChannelAppointmentForm";
import Steps from "@/components/layout/channeling/widgets/steps";
import { usePatient } from "@/hooks/use-patient";
import { apiService } from "@/libs/api";
import { channelSchema } from "@/schemas/channel-schema";
import { AppointmentResponse } from "@/types/users";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
export default function ChannelAppointment() {
  const [stepsComplete, setStepsComplete] = useState(0);
  const { form, userId } = usePatient();
  const numSteps = 4;

  const handleSetStep = () => {
    setStepsComplete((pv) => {
      if (pv + 1 < 0) return 0;
      if (pv + 1 > numSteps) return numSteps;
      return pv + 1;
    });
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
          handleSetStep();
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
      <div className="py-4 pb-10 px-4 my-4 bg-gray-100 border-2 border-dashed border-black/20 rounded-lg">
        <div className="flex flex-col gap-4 justify-center items-center">
          {stepsComplete === 0 && (
            <ChannelAppointmentForm form={form} handleSubmit={handleSubmit} />
          )}
          {stepsComplete === 1 && <div>test</div>}
        </div>
      </div>
    </div>
  );
}
