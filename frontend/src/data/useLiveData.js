import { useQuery } from "@tanstack/react-query";
import { fetchPublic } from "@/lib/api";

// Returns saved live data for a domain, or null while loading / when no saved
// record exists — callers fall back to the local mock data files.
// Scoring polls every 30s so the leaderboard updates itself during the live round.
export const useLiveData = (domain) =>
  useQuery({
    queryKey: ["public", domain],
    queryFn: () => fetchPublic(domain),
    staleTime: domain === "scoring" ? 10_000 : 30_000,
    refetchInterval: domain === "scoring" ? 30_000 : false,
    retry: 1,
  }).data ?? null;
