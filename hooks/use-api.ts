import { createApiClient } from "@/lib/api/client";
import { useAuth } from "@clerk/expo";
import { useMemo } from "react";

export const useApi = () => {
  const { getToken } = useAuth();

  return useMemo(() => createApiClient(getToken), [getToken]);
};
