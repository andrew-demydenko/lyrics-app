"use client";

import { useUserSongs, useSharedSongs } from "@/hooks/songs";
import { TSong } from "@/types/song";
import Loader from "@/components/loader";
import SongItem from "./song-item";
import Button from "@/components/button";

export default function SongsList({ userId }: { userId?: string }) {
  const { data, isLoading } = userId ? useUserSongs(userId) : useSharedSongs();

  const getContent = (data: TSong[], isLoading: boolean) => {
    return (
      <div className="container mx-auto p-6">
        {isLoading && <Loader loading={true} />}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Lyrics</h1>
          <div>
            <Button href="/songs/add" className="ml-4">
              Add Song
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {data?.length ? (
            data.map((song: TSong) => <SongItem key={song.id} song={song} />)
          ) : (
            <div>There are no lyrics.</div>
          )}
        </div>
      </div>
    );
  };

  return getContent(data as TSong[], isLoading);
}
