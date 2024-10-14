import { CHORDS } from "@/constants/chords";

export type TChordPosition = [number, (typeof CHORDS)[number], string];
export type TChordPositions = TChordPosition[];

export type TSong = {
  id: string;
  name: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  chords: string;
  text: string;
  shared: boolean;
  userId: string;
  chordPositions: TChordPositions;
  user: {
    name: string;
  };
};
