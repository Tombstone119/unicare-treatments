"use client";

import { getColumns } from "@/channeling/elements/table-elements/patient-columns";
import { DataTable } from "@/channeling/ui/my-appointments";
import { apiService } from "@/libs/api";
import { AppointmentResponse, IAppointment } from "@/types/appointment";
import { Stethoscope } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<IAppointment[]>([]);
  const { data: session } = useSession();
  const user = session?.user;

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
    if (user?.id) {
      getData();
    }
  }, [user?.id]);
  return (
    <div className=" bg-white py-5 px-10 min-h-svh">
      <div className="flex flex-col gap-1 justify-center items-center">
        <h1 className="text-2xl font-bold text-gray-800 text-center flex items-center gap-2 mb-4">
          My Appointments <Stethoscope className="h-8 w-8 text-black" />
        </h1>
        <DataTable columns={columns} data={data}>
          <>
            {/* <Link
              href="/channeling/channel-appointment"
              className="flex items-center gap-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3"
            >
              <PlusIcon className="h-4 w-4 text-gray-600" />
              Add
            </Link> */}
          </>
        </DataTable>
      </div>
    </div>
  );
}
