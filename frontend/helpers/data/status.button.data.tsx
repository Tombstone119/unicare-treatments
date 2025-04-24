import { FaClock } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { SiCashapp } from "react-icons/si";

export const appointmentStatusObj = {
  waiting: {
    iconCss: "w-4 h-4",
    text: "Waiting",
    color: "bg-yellow-500/50 text-yellow-900 border-yellow-600",
    icon: FaClock,
    key: "waiting",
  },
  attending: {
    iconCss: "w-4 h-4",
    text: "Attending",
    color: "bg-blue-500/50 text-blue-900 border-blue-600",
    icon: FaCircleCheck,
    key: "attending",
  },
  completed: {
    iconCss: "w-4 h-4",
    text: "Completed",
    color: "bg-green-500/50 text-green-900 border-green-600",
    icon: FaCircleCheck,
    key: "completed",
  },
  cancelled: {
    iconCss: "w-5 h-5",
    text: "Cancelled",
    color: "bg-red-500/50 text-red-900 border-red-600",
    icon: IoIosCloseCircle,
    key: "cancelled",
  },
  "no-show": {
    iconCss: "w-5 h-5",
    text: "No Show",
    color: "bg-red-500/50 text-red-900 border-red-600",
    icon: IoIosCloseCircle,
    key: "no-show",
  },
};

export type TAppointmentStatus = keyof typeof appointmentStatusObj;

export const paymentStatusObj = {
  pending: {
    text: "Pending",
    secondaryText: "Pay Now",
    color: "bg-yellow-500/50 text-yellow-900 border-yellow-600",
    icon: SiCashapp,
    key: "pending",
    iconCss: "w-3 h-3",
  },
  completed: {
    text: "Completed",
    secondaryText: "Payment Done",
    color: "bg-green-500/50 text-green-900 border-green-600",
    icon: FaCircleCheck,
    key: "completed",
    iconCss: "w-4 h-4",
  },
  cancelled: {
    text: "Cancelled",
    secondaryText: "Cancelled",
    color: "bg-red-500/50 text-red-900 border-red-600",
    icon: IoIosCloseCircle,
    key: "cancelled",
    iconCss: "w-4 h-4",
  },
};

export type TPaymentStatus = keyof typeof paymentStatusObj;
