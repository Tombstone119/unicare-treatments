"use client";

import { getColumns } from "@/channeling/ui/columns/user-column";
import { useEffect, useState } from "react";
import { UserIcon } from "lucide-react";
import { apiService } from "@/libs/api";
import { DataTable } from "@/channeling/ui/tables/user-table";
import { IUser, UserApiResponse } from "@/types/users";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const { data: session } = useSession();
  const user = session?.user;

  const getData = async (accessToken?: string) => {
    try {
      const token = accessToken || user?.accessToken;
      const response = await apiService.get<UserApiResponse>(`/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.success) {
        setAllUsers(response?.users || []);
      }
    } catch {
      // if (error instanceof AxiosError) {
      //   if (
      //     error.response?.status === 403 &&
      //     error.response?.data.message === "Invalid or expired token."
      //   ) {
      //     const refreshed = await apiService.post<GetTokenResponse>(
      //       `/users/refreshToken`,
      //       {
      //         refreshToken: session?.user.refreshToken,
      //       }
      //     );
      //     console.log("refreshed: =-->", refreshed);
      //     // if (refreshed) {
      //     //   return getData(refreshed?.accessToken);
      //     // }
      //   }
      // }
    }
  };

  const refreshPage = () => {
    getData();
  };

  const columns = getColumns(refreshPage);

  useEffect(() => {
    if (!user) return;
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className=" bg-white py-5 px-5 w-full min-h-svh md:w-[calc(100vw-260px)] mx-auto">
      <div className="flex flex-col gap-1 justify-center items-center">
        <h1 className="text-2xl font-bold text-gray-800 text-center flex items-center gap-2 mb-4">
          System Users <UserIcon className="h-8 w-8 text-black" />
        </h1>
        <DataTable columns={columns} data={allUsers}></DataTable>
      </div>
    </div>
  );
}
