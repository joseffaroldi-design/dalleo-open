import { useQuery } from "@tanstack/react-query";
import { fetchPublic } from "@/lib/api";

// Returns saved live data for a domain, or null while loading / when no saved
// record exists — callers fall back to the local mock data files.
export const useLiveData = (domain) =>
  useQuery({
    queryKey: ["public", domain],
    queryFn: () => fetchPublic(domain),
    staleTime: 30_000,
    retry: 1,
  }).data ?? null;
