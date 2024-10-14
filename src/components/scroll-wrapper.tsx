"use client";

import React, { useState, useRef, useEffect } from "react";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { CHORDS, GROUPED_CHORDS } from "@/constants/chords";
import Button from "./button";

interface ScrollWrapperProps {
  children: React.ReactElement;
}

const getChordIndex = (
  chord: string
): { group: string[]; index: number } | null => {
  for (const group of Object.values(GROUPED_CHORDS)) {
    const index = group.indexOf(chord);
    if (index !== -1) return { group, index };
  }
  return null;
};

const transposeChord = (chord: string, steps: number): string => {
  const data = getChordIndex(chord);
  if (!data || data.index === null) return chord;
  const newIndex = (data.index + steps + data.group.length) % data.group.length;

  return data.group[newIndex];
};

const speeds = [1, 2, 3];

const ScrollWrapper: React.FC<ScrollWrapperProps> = ({ children }) => {
  const [scrolling, setScrolling] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [fontSize, setFontSize] = useState(1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [transposition, setTransposition] = useState<number>(0);

  const startScrolling = (force: boolean) => {
    if (!force && (scrolling || !containerRef.current)) return;

    if (force && scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
    }
    setScrolling(true);
    scrollIntervalRef.current = setInterval(() => {
      if (
        containerRef.current &&
        containerRef.current.scrollTop <
          containerRef.current.scrollHeight - containerRef.current.clientHeight
      ) {
        containerRef.current.scrollTop += (1 * speedMultiplier) / 1.8;
      } else {
        stopScrolling();
      }
    }, 50);
  };

  const stopScrolling = () => {
    setScrolling(false);
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  const handleSpeedChange = (multiplier: number) => {
    setSpeedMultiplier(multiplier);
  };

  const increaseFontSize = () =>
    setFontSize((prev) => (prev < 1.5 ? prev + 0.1 : prev));
  const decreaseFontSize = () =>
    setFontSize((prev) => (prev > 0.5 ? prev - 0.1 : prev));

  useEffect(() => {
    if (scrolling && scrollIntervalRef.current) {
      startScrolling(true);
    }
  }, [speedMultiplier]);

  useEffect(() => {
    return () => {
      stopScrolling();
    };
  }, []);

  return (
    <div className="flex flex-col items-center min-h-0">
      <div className="w-full flex md:justify-between md:flex-row flex-col">
        <div className="flex space-x-4 mb-3">
          <Button
            size="sm"
            className="flex items-center"
            onClick={() => startScrolling(false)}
            disabled={scrolling}
          >
            <PlayArrowIcon className="h-5 w-5 mr-2" />
            Play
          </Button>
          <Button
            size="sm"
            className="flex items-center !py-1"
            variant="danger"
            onClick={stopScrolling}
            disabled={!scrolling}
          >
            <PauseIcon className="h-5 w-5 mr-2" />
            Stop
          </Button>
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <label>Speed:</label>
          {speeds.map((speed) => (
            <Button
              size="sm"
              variant="secondary"
              key={speed}
              active={speed === speedMultiplier}
              onClick={() => handleSpeedChange(speed)}
            >
              {speed}x
            </Button>
          ))}
        </div>
        <div className="flex items-center space-x-2 mb-3">
          <label>Size:</label>
          <Button size="sm" onClick={increaseFontSize}>
            +
          </Button>
          <Button size="sm" onClick={() => setFontSize(1)}>
            D
          </Button>
          <Button size="sm" onClick={decreaseFontSize}>
            -
          </Button>
        </div>

        <div className="flex items-center w-20 mb-3">
          <label className="mr-2" htmlFor="transposition">
            Key:
          </label>
          <input
            className="form-input !py-1 !px-1 !rounded-md"
            name="transposition"
            type="number"
            value={transposition}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value < -9 || value > 9) return;
              setTransposition(value);
            }}
          />
        </div>
      </div>
      <div
        ref={containerRef}
        className="overflow-auto border border-gray-300 w-full mb-4 flex-1"
      >
        <div
          style={{
            fontSize: `${fontSize}rem`,
            lineHeight: `${fontSize * 1.7}rem`,
          }}
          className="space-y-2"
        >
          {React.cloneElement(children, {
            toneKey: transposition,
          })}
        </div>
      </div>
    </div>
  );
};

export default ScrollWrapper;
