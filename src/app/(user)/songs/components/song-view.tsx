"use client";

import { TSong } from "@/types/song";
import { useEffect, useState } from "react";
import ChordRiffPicker from "./chords-riff-picker";
import { CHORDS } from "@/constants/chords";
import { TChordPositions } from "@/types/song";
import { transposeLyricChords, transposeChord } from "@/utils/song";
import { set } from "react-hook-form";

type TEditable = {
  handleAddChord: (line: string, charIndex: number) => void;
  handleRemoveChord: (line: string, charIndex: number) => void;
  handleChordsRiff: (chords: typeof CHORDS, lineIndex: number) => void;
};

const isChordsRiff = (text: string) => {
  if (!text) return false;
  const parts = text.split(/\s+/);
  return parts.every(
    (part) => !part.trim() || ["|"].includes(part) || CHORDS.includes(part)
  );
};

const isNotLyricLine = (line: string) => {
  const keywords = ["вступление", "припев"];
  const specialSymbolsRegex = /[|\(\)\{\}\[\]_]|--+/;
  const keywordsRegex = new RegExp(keywords.join("|"), "i");

  return specialSymbolsRegex.test(line) || keywordsRegex.test(line);
};

export default function SongView({
  song,
  editable,
  toneKey,
}: {
  song: Pick<TSong, "text" | "chordPositions">;
  editable?: TEditable;
  toneKey?: number;
}) {
  const { text, chordPositions } = song;
  const [textByLines, setTextByLines] = useState<string[]>([]);
  const [transposedChords, setTransposeChords] =
    useState<TChordPositions>(chordPositions);

  useEffect(() => {
    setTextByLines(text ? text.split("\n") : []);
  }, [text]);

  useEffect(() => {
    if (typeof toneKey !== "undefined") {
      setTransposeChords(transposeLyricChords(chordPositions, toneKey));
    }
  }, [toneKey]);

  useEffect(() => {
    setTransposeChords(chordPositions);
  }, [chordPositions]);

  if (!text) {
    return null;
  }

  return (
    <div className="mt-6 ml-4 relative">
      {editable ? (
        <p className="mb-8 font-medium">
          Click on a character to add the selected chord:
        </p>
      ) : null}
      {textByLines.map((line, lineIndex) => {
        const chordsOnLineOut = transposedChords.filter(
          (chord) => chord[2] === line && line.length < chord[0]
        );

        if (!line.trim() || isChordsRiff(line)) {
          const chords = line.split(" ").filter((c) => {
            return CHORDS.includes(c);
          });
          return (
            <div key={lineIndex} className="mb-2">
              {editable ? (
                <div className="inline-block mr-2">
                  <ChordRiffPicker
                    chordsRiff={chords}
                    onSave={(chords) => {
                      editable.handleChordsRiff(chords, lineIndex);
                    }}
                  />
                </div>
              ) : null}

              {chords.length
                ? chords.map((chord, index) => {
                    return (
                      <div
                        key={`chord-${index}`}
                        className="text-red-500 mr-2 relative inline-block"
                      >
                        {transposeChord(chord, toneKey || 0)}
                      </div>
                    );
                  })
                : "\u00A0"}
            </div>
          );
        }

        if (isNotLyricLine(line)) {
          return (
            <div key={lineIndex} className="mb-2">
              {line}
            </div>
          );
        }

        return (
          <div key={lineIndex} className="relative mb-2">
            <div className="mt-5 font-mono">
              {line.split("").map((char, charIndex) => {
                const chord = transposedChords.find(
                  (c) => c[0] === charIndex && c[2] === line
                );
                return (
                  <span key={charIndex} className="relative">
                    {chord && (
                      <div className="absolute text-nowrap bottom-[1.1rem] left-0 text-red-500">
                        {chord[1]}
                        {editable ? (
                          <button
                            onClick={() =>
                              editable.handleRemoveChord(line, charIndex)
                            }
                            className="flex items-center absolute z-10 -top-[2px] -right-2 text-[10px] text-red-500 hover:text-red-700 hover:bg-red-100 transition-colors duration-100 px-0.5 py-0 rounded h-3"
                          >
                            x
                          </button>
                        ) : null}
                      </div>
                    )}
                    {editable ? (
                      <span
                        onClick={() => editable.handleAddChord(line, charIndex)}
                        className="cursor-pointer"
                      >
                        {char.trim() ? char : "\u00A0"}
                      </span>
                    ) : (
                      <span>{char.trim() ? char : "\u00A0"}</span>
                    )}

                    {line.length - 1 === charIndex && chordsOnLineOut.length ? (
                      <div className="flex absolute  bottom-[1.1rem] -left-[calc(100%-20px)]">
                        {chordsOnLineOut.map((chord) => {
                          return (
                            <div
                              key={`chord-${chord[0]}-${chord[1]}-${chord[2]}`}
                              className="text-red-500 ml-2 relative"
                            >
                              {chord[1]}
                              {editable ? (
                                <button
                                  onClick={() =>
                                    editable.handleRemoveChord(line, chord[0])
                                  }
                                  className="flex items-center absolute z-10 -top-[2px] -right-2 text-[10px] text-red-500 hover:text-red-700 hover:bg-red-100 transition-colors duration-100 px-0.5 py-0 rounded h-3"
                                >
                                  x
                                </button>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
