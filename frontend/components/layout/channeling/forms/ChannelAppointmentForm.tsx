"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/shadcn/ui/form";

import ChannelingSubmitBtn from "@/components/layout/channeling/buttons/ChannelingSubmitBtn";
import InputElement from "./form-elements/input-element";
import DateElement from "./form-elements/date-element";
import SelectElement from "./form-elements/select-element";
import { toast } from "sonner";

import {
  channelAppointmentSchema,
  channelSchema,
} from "@/helpers/validation/channel-schema";
import { SelectItem } from "@/shadcn/ui/select";
import {
  Calendar,
  ContactRound,
  MailIcon,
  Phone,
  MapPin,
  CircleUser,
  UsersRound,
  Stethoscope,
} from "lucide-react";
import { apiService } from "@/libs/api";
import { AppointmentResponse, UserApiResponse } from "@/types/users";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function ChannelAppointmentForm() {
  const { data: session } = useSession();

  const user = session?.user;

  const form = useForm<channelSchema>({
    resolver: zodResolver(channelAppointmentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "other",
      maritalState: "single",
      phoneNumber: "",
      email: "",
      address: "",
      appointmentDate: undefined,
    },
  });

  useEffect(() => {
    const fetchUserAppointments = async () => {
      if (!user?.id) return;
      const response = await apiService.get<UserApiResponse>(
        `/user/${user?.id}`
      );

      const test = new Date(response.user?.dateOfBirth || "");
      const formattedDate = test.toISOString().split("T")[0];

      console.log("formattedDate: =-->", formattedDate);

      form.reset({
        ...form.getValues(),
        email: response.user?.email,
        gender: response.user?.gender || "other",
        maritalState: response.user?.maritalState || "single",
        firstName: response.user?.firstName || "",
        lastName: response.user?.lastName || "",
        ...(response.user?.dateOfBirth && {
          dateOfBirth: formattedDate,
        }),
        ...(response.user?.phoneNumber && {
          phoneNumber: response.user?.phoneNumber || "",
        }),
        ...(response.user?.phoneNumber && {
          address: response.user?.address || "",
        }),

        // phoneNumber: response.user?.phoneNumber,
        // address: response.user?.address,
      });
      console.log(response);
    };
    fetchUserAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSubmit = async (values: channelSchema) => {
    try {
      if (user?.id) {
        const response = await apiService.post<AppointmentResponse>(
          `/appointments/patientAppointments`,
          { ...values, patientId: user?.id }
        );
        if (response.success) {
          toast.success(
            `Appointment successfully created!. Ref:${response.appointment?._id}`
          );
        }
        if (!response.success) {
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
    <div className="relative w-full max-w-2xl shadow-lg rounded-lg p-6 bg-white">
      <div className="absolute bg-cover bg-scope w-[150px] h-[150px] right-0 top-0 z-50 translate-x-1/4 -translate-y-2/4"></div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-5 "
        >
          <div>Patient Details</div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-5">
              <InputElement
                form={form}
                fieldName="firstName"
                fieldType="text"
                label="First Name"
                placeholder="First Name"
                icon={<ContactRound className="h-5 w-5 text-gray-600" />}
              />
              <InputElement
                form={form}
                fieldName="dateOfBirth"
                fieldType="date"
                label="Date of Birth"
                placeholder="Date of Birth"
                icon={<Calendar className="h-5 w-5 text-gray-600" />}
              />
              <InputElement
                form={form}
                fieldName="phoneNumber"
                fieldType="tel"
                label="Phone Number"
                placeholder="Phone Number"
                icon={<Phone className="h-5 w-5 text-gray-600" />}
              />

              <SelectElement
                form={form}
                fieldName="maritalState"
                label="Marital State"
                icon={<UsersRound className="h-5 w-5 text-gray-600" />}
              >
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
              </SelectElement>
            </div>
            <div className="flex flex-col gap-5">
              <InputElement
                form={form}
                fieldName="lastName"
                fieldType="text"
                label="Last Name"
                placeholder="Last Name"
                icon={<ContactRound className="h-5 w-5 text-gray-600" />}
              />
              <InputElement
                disabled={true}
                form={form}
                fieldName="email"
                fieldType="email"
                label="Email"
                placeholder="Email"
                icon={<MailIcon className="h-5 w-5 text-gray-600" />}
              />
              <InputElement
                form={form}
                fieldName="address"
                fieldType="text"
                label="Address"
                placeholder="Address"
                icon={<MapPin className="h-5 w-5 text-gray-600" />}
              />
              <SelectElement
                form={form}
                fieldName="gender"
                label="Gender Status"
                icon={<CircleUser className="h-5 w-5 text-gray-600" />}
              >
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Prefer not to state</SelectItem>
              </SelectElement>
            </div>
          </div>
          <div>Appointment Details</div>
          <div>
            <DateElement
              form={form}
              label="Available Dates"
              icon={<Calendar className="h-5 w-5 text-gray-600" />}
            />
          </div>

          <ChannelingSubmitBtn isLoading={form.formState.isSubmitting}>
            <Stethoscope className="h-5 w-5 text-white" />
            Submit
          </ChannelingSubmitBtn>
        </form>
      </Form>
    </div>
  );
}
