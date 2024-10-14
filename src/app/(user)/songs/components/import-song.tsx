import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react"; // Используем Headless UI для модального окна
import { toast } from "sonner";
import Button from "@/components/button";
import Textarea from "@/components/textarea";
import Checkbox from "@/components/checkbox";
import { CHORDS } from "@/constants/chords";
import { TChordPositions } from "@/types/song";

interface ChordTextPart {
  chords?: TChordPositions;
  text: string;
}

const isChordsLine = (text: string) => {
  if (!text) return false;
  const parts = text.split(/\s+/);
  return parts.some((part) => CHORDS.includes(part));
};

function addExtraSpaceOnRepeat(lines: string[]) {
  const seenLines = new Map();

  return lines.map((line) => {
    if (seenLines.has(line)) {
      const repeatCount = seenLines.get(line);
      seenLines.set(line, repeatCount + 1);
      return line + " ".repeat(repeatCount);
    } else {
      seenLines.set(line, 1);
      return line;
    }
  });
}

const parseChordText = (
  text: string,
  autoFixChords: boolean
): ChordTextPart => {
  const chordPositions: TChordPositions = []; // Для хранения позиций аккордов
  let cleanText = ""; // Текст без аккордов
  let charIndex = 0; // Индекс символов в общем тексте

  const lines = addExtraSpaceOnRepeat(text.split("\n"));
  let lineIndex = 0; // Индекс строки

  lines.forEach((line, index) => {
    const parts = line.split(/(\s+)/); // Разделение строки на слова и пробелы
    const hasChords = isChordsLine(line); // Флаг для проверки наличия аккордов
    let lineCharIndex = 0; // Учет текущего индекса символов для аккордов
    const nextLine = lines[index + 1];
    const prevLine = lines[index - 1];

    if (hasChords) {
      // Если в строке есть аккорды, обрабатываем их

      if (!nextLine?.trim() || isChordsLine(nextLine)) {
        lineIndex += 1;
        cleanText += `| ${line}\n`;
      }
      parts.forEach((part) => {
        const isChord = CHORDS.includes(part); // Проверяем, является ли часть аккордом

        if (isChord) {
          // Если аккорд слишком близко к предыдущему, сдвигаем его
          const prev = chordPositions[lineIndex - 1];
          if (prev && prev[2] === nextLine && prev[0] - lineCharIndex < 3) {
            lineCharIndex += 2;
          }

          // Сохраняем аккорд с текущей позицией
          chordPositions.push([lineCharIndex, part, nextLine]);
        } else {
          // Увеличиваем индекс для текущей строки
          lineCharIndex +=
            autoFixChords && part.length > 5
              ? Math.round(part.length / 1.6)
              : part.length;
        }
      });
      // Не добавляем строку с аккордами в чистый текст
    } else {
      if (line.trim() && !isChordsLine(prevLine)) {
        cleanText += "| ";
      }
      // Если нет аккордов, добавляем строку в чистый текст
      lineIndex += 1; // Увеличиваем индекс строки
      cleanText += line + "\n"; // Удаляем лишние пробелы и добавляем перенос строки
    }

    // Увеличиваем общий индекс на длину текущей строки
    charIndex += line.length;
  });

  return { text: cleanText.trim(), chords: chordPositions };
};

export default function ImportSong({
  onImport,
}: {
  onImport: (data: ChordTextPart) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [importText, setImportText] = useState<string>("");
  const [autoFixChords, setAutoFixChords] = useState(false);

  const handleImportSubmit = () => {
    if (!importText) {
      toast.error("Please insert text to import.");
      return;
    }

    const parsedData = parseChordText(importText, autoFixChords);

    onImport(parsedData);
    setIsModalOpen(false);
    setImportText("");
    toast.success("Text imported successfully!");
  };

  return (
    <div>
      <Button
        className="w-full"
        type="button"
        onClick={() => setIsModalOpen(true)}
      >
        Import song
      </Button>

      <Dialog
        autoFocus
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="bg-white/60 fixed inset-0 z-50 flex items-center justify-center"
      >
        <DialogPanel className="-mt-20 w-3/4 bg-white p-6 rounded shadow-lg">
          <h2 className="text-lg font-medium mb-4">Import song with chords</h2>
          <Textarea
            className="font-mono"
            name="importText"
            label="Lyrics with Chords"
            rows={12}
            placeholder="Paste your song text with chords here"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
          />
          <Checkbox
            className="mt-2 mb-5"
            label="Auto fix chord alignment"
            value={autoFixChords}
            name="autoFixChords"
            onChange={() => setAutoFixChords(!autoFixChords)}
          />
          <Button
            disabled={!importText}
            type="button"
            onClick={handleImportSubmit}
          >
            Submit
          </Button>
          <Button
            variant="danger"
            onClick={() => setIsModalOpen(false)}
            className="ml-2"
          >
            Cancel
          </Button>
        </DialogPanel>
      </Dialog>
    </div>
  );
}
