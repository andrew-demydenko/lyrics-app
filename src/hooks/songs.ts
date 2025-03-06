import {
  useMutation,
  useQuery,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  getSongById,
  getUserSongs,
  getSharedSongs,
  deleteSong,
} from "@/services/song.service";
import { TSong } from "@/types/song";

export const useSongById = (
  id: string,
  options?: UseQueryOptions<TSong | null>
) => {
  return useQuery<TSong | null, Error>({
    queryKey: ["song", id],
    queryFn: () => getSongById(id),
    staleTime: 1000 * 10,
    retry: false,
    ...options,
  });
};

export const useSongs = (
  userId?: string,
  options?: UseQueryOptions<TSong[]>
) => {
  return useQuery<TSong[], Error>({
    queryKey: userId ? ["songs", userId] : ["songs"],
    queryFn: () => (userId ? getUserSongs(userId) : getSharedSongs()),
    staleTime: 1000 * 10,
    retry: false,
    ...options,
  });
};

export const useSongDelete = (
  id: string,
  options: UseMutationOptions<TSong>
) => {
  return useMutation({
    mutationFn: () => deleteSong(id),
    ...options,
  });
};
