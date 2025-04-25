"use client";

import { getColumns } from "@/channeling/elements/table-elements/patient-column";
import { useEffect, useState } from "react";
import { UserIcon } from "lucide-react";
import { AppointmentResponse, IAppointment } from "@/types/appointment";
import { apiService } from "@/libs/api";
import { useSession } from "next-auth/react";
import { DataTable } from "@/channeling/ui/user-table";

export default function Users() {
  const [data, setData] = useState<IAppointment[]>([]);
  const { data: session } = useSession();
  const user = session?.user;

  const getData = async () => {
    const response = await apiService.get<AppointmentResponse>(
      `/appointments/patient/${user?.id}`
    );
    if (response.success) {
      setData(response?.appointments || []);
    }
  };

  const columns = getColumns(user?.id || "");

  useEffect(() => {
    if (user?.id) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <div className=" bg-white py-5 px-5 w-full min-h-svh md:w-[calc(100vw-260px)] mx-auto">
      <div className="flex flex-col gap-1 justify-center items-center">
        <h1 className="text-2xl font-bold text-gray-800 text-center flex items-center gap-2 mb-4">
          System Users <UserIcon className="h-8 w-8 text-black" />
        </h1>
        <DataTable columns={columns} data={data}></DataTable>
      </div>
    </div>
  );
}
