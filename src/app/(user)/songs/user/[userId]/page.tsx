import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
} from "@tanstack/react-query";
import SongsList from "../../components/songs-list";
import { getUserSongs } from "@/services/song.service";

const UserSongs = async ({ params }: { params: { userId: string } }) => {
  const { userId } = params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["songs", userId],
    queryFn: () => getUserSongs(userId),
  });

  return (
    <div className="h-full">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SongsList userId={userId} />
      </HydrationBoundary>
    </div>
  );
};

export default UserSongs;
