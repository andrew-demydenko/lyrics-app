"use client";

import { useState } from "react";
import Link from "next/link";
import ConfirmModal from "@/components/confirm-modal";
import Button from "@/components/button";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/providers/auth-provider";
import EditButton from "@app/songs/components/edit-button";
import { TSong } from "@/types/song";
import { toast } from "sonner";
import { useSongDelete } from "@/hooks/songs";

const SongItem = ({ song }: { song: TSong }) => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isOwner = user?.id === song.userId;

  const { mutate } = useSongDelete(song.id, {
    onSettled: () => {
      setIsModalOpen(false);
    },
    onSuccess: () => {
      toast.success("Song is deleted");
      queryClient.invalidateQueries({
        queryKey: ["shared-songs"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-songs", user?.id],
      });
    },
    onError: () => {
      toast.error("Failed to delete song");
    },
  });

  return (
    <div
      key={song.id}
      className="flex items-center justify-between p-4 bg-white shadow rounded-lg"
    >
      <div>
        <Link
          className="text-lg font-medium text-blue-600 hover:underline"
          href={`/songs/${song.id}`}
        >
          {song.name}
        </Link>
        <p className="text-sm text-gray-600">by {song.author}</p>
      </div>

      {isOwner ? (
        <div className="flex space-x-2">
          <EditButton size="sm" song={song} />
          <Button
            size="sm"
            variant="dangerOutline"
            onClick={() => setIsModalOpen(true)}
          >
            Delete
          </Button>
        </div>
      ) : null}
      <ConfirmModal
        isOpen={isModalOpen}
        title="Delete song"
        message={`Are you sure you want to delete the song "${song.name}"?`}
        onConfirm={mutate}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default SongItem;
