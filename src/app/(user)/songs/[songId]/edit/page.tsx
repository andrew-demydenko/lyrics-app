import { getSongById } from "@/services/song.service";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import EditSongContent from "./content";

export const metadata: Metadata = {
  title: "Song Editor",
};

async function EditSongPage({ params }: { params: { songId: string } }) {
  const { songId } = params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["song", songId],
    queryFn: () => getSongById(songId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditSongContent songId={songId} />
    </HydrationBoundary>
  );
}

export default EditSongPage;
