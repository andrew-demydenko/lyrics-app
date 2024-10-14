"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Input from "@/components/input";
import Textarea from "@/components/textarea";
import Button from "@/components/button";
import Checkbox from "@/components/checkbox";
import { CHORDS } from "@/constants/chords";
import { useAuthContext } from "@/providers/auth-provider";
import ImportSong from "./import-song";
import { axiosWrapper } from "@/lib/axios";
import SongView from "@app/songs/components/song-view";
import { TSong, TChordPositions } from "@/types/song";

interface IFormInputs {
  name: string;
  author: string;
  text: string;
  shared: boolean;
  chords?: string;
}

const INPUTS = {
  name: {
    required: "Name is required",
  },
  author: {
    required: "Author is required",
  },
  text: {
    required: "Text is required",
  },
};

export default function SongForm({ editData }: { editData?: TSong | null }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitted },
    watch,
    setValue,
    reset,
  } = useForm<IFormInputs>();
  const { user } = useAuthContext();
  const router = useRouter();
  const [selectedChord, setSelectedChord] = useState<string>(CHORDS[0]);
  const [chordPositions, setChordPositions] = useState<TChordPositions>([]);

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (data: IFormInputs) => {
      const requestData = { ...data, userId: user?.id };
      if (editData) {
        const song = await axiosWrapper.patch(
          `/songs/${editData.id}`,
          requestData
        );

        return song.data;
      } else {
        const song = await axiosWrapper.post("/songs", requestData);

        return song.data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["shared-songs"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-songs", user?.id],
      });
      router.push(`/songs/${data.id}`);
      toast.success("Song saved successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to save the song");
    },
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    mutate({ ...data, chords: JSON.stringify(chordPositions) });
  };

  const watchedText = watch("text");

  useEffect(() => {
    if (editData) {
      reset(editData);
      if (editData.chordPositions) {
        setChordPositions(editData.chordPositions);
      }
    }
  }, [editData, reset]);

  const isDistanceValid = (line: string, charIndex: number) => {
    return !chordPositions.some((chord) => {
      const [existingCharIndex, _, existingLine] = chord;
      if (
        existingLine === line &&
        Math.abs(existingCharIndex - charIndex) < 5
      ) {
        return true;
      }
    });
  };

  const handleAddChord = (line: string, charIndex: number) => {
    if (!selectedChord) {
      toast.error("Please select a chord to add.");
      return;
    }
    if (!isDistanceValid(line, charIndex)) {
      toast.error(
        "Chord must be at least 5 characters away from other chords."
      );
      return;
    }
    setChordPositions((prev) => [...prev, [charIndex, selectedChord, line]]);
    toast.success(
      `Added "${selectedChord}" to line "${line}", position ${charIndex}`
    );
  };

  const handleRemoveChord = (line: string, charIndex: number) => {
    setChordPositions(
      chordPositions.filter(
        (chord) => !(chord[0] === charIndex && chord[2] === line)
      )
    );
    toast.success(`Removed chord from line "${line}", position ${charIndex}`);
  };

  const handleChordsRiff = (chords: typeof CHORDS, lineIndex: number) => {
    const lines = watchedText.split("\n");
    if (lineIndex !== null && lineIndex < lines.length) {
      const chordsString = chords.join(" ");
      lines[lineIndex] = `| ${chordsString}`;
      setValue("text", lines.join("\n"));
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          register={register("name", INPUTS["name"])}
          label="Song name"
          type="text"
          error={errors["name"]}
        />
        <Input
          register={register("author", INPUTS["author"])}
          label="Song author"
          type="text"
          error={errors["author"]}
        />
        <Checkbox
          register={register("shared")}
          label="Shared"
          error={errors["shared"]}
        />
        {!editData ? (
          <ImportSong
            onImport={(data) => {
              if (data.chords) setChordPositions(data.chords);
              setValue("text", data.text);
            }}
          />
        ) : null}
        <Textarea
          error={errors["text"]}
          register={register("text", INPUTS["text"])}
          label="Song text"
          rows={12}
        />

        {watchedText?.length ? (
          <div className="flex flex-wrap gap-2 mt-4 h-[135px] overflow-auto p-1 pr-3">
            {CHORDS.map((chord) => (
              <Button
                key={chord}
                size="xs"
                variant="secondary"
                active={selectedChord === chord}
                className="px-2"
                onClick={() => setSelectedChord(chord)}
              >
                {chord}
              </Button>
            ))}
          </div>
        ) : null}

        <SongView
          song={{ text: watchedText, chordPositions }}
          editable={{ handleRemoveChord, handleAddChord, handleChordsRiff }}
        />

        <Button disabled={isSubmitted && !isValid} type="submit">
          {editData ? "Update Song" : "Save Song"}
        </Button>
      </form>
    </div>
  );
}
