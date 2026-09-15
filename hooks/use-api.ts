import { createApiClient } from "@/lib/api/client";
import { useAuth } from "@clerk/expo";
import { useMemo, useRef } from "react";

export const useApi = () => {
  const { getToken } = useAuth();

  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  return useMemo(() => createApiClient(() => getTokenRef.current()), []);
};
