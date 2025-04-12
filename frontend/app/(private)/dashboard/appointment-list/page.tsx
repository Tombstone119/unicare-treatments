"use client";

import { getColumns } from "@/channeling/elements/table-elements/admin-column";
import { DataTable } from "@/channeling/ui/my-appointments";
import { apiService } from "@/libs/api";
import { AppointmentResponse, IAppointment } from "@/types/appointment";
import { Stethoscope } from "lucide-react";
import { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<IAppointment[]>([]);

  const refreshPage = () => {
    getData();
  };

  const getData = async () => {
    const response = await apiService.get<AppointmentResponse>(
      `/appointments/patient`
    );
    if (response.success) {
      setData(response?.appointments || []);
    }
  };

  const columns = getColumns(refreshPage);

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className=" bg-white py-5 px-10 min-h-svh max-w-[calc(100vw-260px)] mx-auto">
      <div className="flex flex-col gap-1 justify-center items-center">
        <h1 className="text-2xl font-bold text-gray-800 text-center flex items-center gap-2 mb-4">
          All Appointments <Stethoscope className="h-8 w-8 text-black" />
        </h1>
        <DataTable columns={columns} data={data}></DataTable>
      </div>
    </div>
  );
}
