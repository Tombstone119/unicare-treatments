"use client";
import { apiService } from "@/libs/api";
import { GetTokenResponse } from "@/types/users";
import { AxiosError } from "axios";
import { toast } from "sonner";

type TResponse = {
  recall: boolean;
  accessToken?: string | null;
};
export default async function getRefetch(
  error: string | AxiosError,
  errorMessage?: string,
  accessToken?: string | null,
  refreshToken?: string | null
): Promise<TResponse> {
  //
  if (
    error instanceof AxiosError &&
    error.response?.status === 403 &&
    errorMessage === "Invalid or expired token."
  ) {
    try {
      const refreshed = await apiService.post<GetTokenResponse>(
        `/users/refreshToken`,
        {
          refreshToken: refreshToken,
        }
      );
      if (refreshed) {
        return {
          recall: true,
          accessToken: refreshed?.accessToken,
        };
      }
    } catch {
      toast.error(
        "Something went wrong while refreshing the token. Please try again."
      );
    }
  } else {
    toast.error("Something went wrong. Please try again.");
  }
  return {
    recall: false,
    accessToken: accessToken,
  };
}
