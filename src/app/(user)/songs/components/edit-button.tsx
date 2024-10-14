"use client";

import { useAuthContext } from "@/providers/auth-provider";
import { TSong } from "@/types/song";
import Button, { TButton } from "@/components/button";

interface TProps extends TButton {
  song: TSong;
}

const EditButton = ({ song, ...props }: TProps) => {
  const { user } = useAuthContext();

  if (song && song.userId === user?.id) {
    return (
      <Button
        variant="primaryOutline"
        {...props}
        href={`/songs/${song.id}/edit`}
      >
        Edit
      </Button>
    );
  }

  return null;
};

export default EditButton;
