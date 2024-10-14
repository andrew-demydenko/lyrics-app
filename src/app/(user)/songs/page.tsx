import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
} from "@tanstack/react-query";
import SongsList from "./components/songs-list";
import { getSharedSongs } from "@/services/song.service";

const SharedSongs = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["shared-songs"],
    queryFn: getSharedSongs,
  });

  return (
    <div className="h-full">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SongsList />
      </HydrationBoundary>
    </div>
  );
};

export default SharedSongs;
