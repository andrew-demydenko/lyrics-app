"use client";

import { notFound } from "next/navigation";
import SongForm from "@app/songs/components/song-form";
import { useSongById } from "@/hooks/songs";
import Button from "@/components/button";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/auth-provider";

function EditSongContent({ songId }: { songId: string }) {
  const { user } = useAuthContext();
  const router = useRouter();
  const { data, isError } = useSongById(songId);

  if (isError) {
    notFound();
  }

  if (data?.userId !== user?.id) {
    router.back();
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold text-gray-900 mx-6">{data?.name}</h1>
        <Button variant="primaryOutline" href={`/songs/${songId}`}>
          Details
        </Button>
      </div>

      <div className="overflow-auto">
        <SongForm editData={data} />
      </div>
    </div>
  );
}

export default EditSongContent;
