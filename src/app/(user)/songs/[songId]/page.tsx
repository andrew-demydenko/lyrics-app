import { notFound } from "next/navigation";
import { Metadata } from "next/types";
import { getSongById } from "@/services/song.service";
import SongView from "@app/songs/components/song-view";
import EditButton from "@app/songs/components/edit-button";
import ScrollWrapper from "@/components/scroll-wrapper";

export const revalidate = 20;

export async function generateMetadata({
  params,
}: {
  params: { songId: string };
}): Promise<Metadata> {
  const song = await getSongById(params.songId);

  return {
    title: song?.name,
    description: `Песня ${song?.name} от ${song?.author}.`,
  };
}

export default async function SongPage({
  params,
}: {
  params: { songId: string };
}) {
  const { songId } = params;
  const song = await getSongById(songId);

  if (!song) {
    return notFound();
  }

  return (
    <div className="h-full flex flex-col">
      <>
        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {song?.name}
            </h1>
            <h3 className="text-xl text-gray-600 mb-6">
              Author: {song?.author}
            </h3>
          </div>
          <div className="ml-5">
            <EditButton song={song} />
          </div>
        </div>

        {song ? (
          <div className="border-t border-gray-200 pt-3 flex flex-col min-h-0">
            <ScrollWrapper>
              <SongView song={song} />
            </ScrollWrapper>
          </div>
        ) : null}
      </>
    </div>
  );
}
