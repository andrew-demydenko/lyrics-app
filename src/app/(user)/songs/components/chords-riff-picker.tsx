import { useEffect, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import BackspaceIcon from "@mui/icons-material/Backspace";
import { CHORDS } from "@/constants/chords";
import Button from "@/components/button";
import { toast } from "sonner";

export default function ChordRiffPicker({
  chordsRiff = [],
  onSave,
}: {
  onSave: (chords: typeof CHORDS) => void;
  chordsRiff: typeof CHORDS;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChords, setSelectedChords] = useState<typeof CHORDS>([]);

  const setChord = (chord: string) => {
    setSelectedChords([...selectedChords, chord]);
  };

  const handleRemoveChord = (index: number) => {
    setSelectedChords(selectedChords.filter((_, i) => i !== index));
  };

  useEffect(() => {
    setSelectedChords(chordsRiff);
  }, [chordsRiff]);

  const handleSave = () => {
    if (selectedChords.length === 0) {
      toast.error("No chords selected.");
      return;
    }

    onSave(selectedChords);

    setIsModalOpen(false);
    toast.success("Guitar riff is set.");
  };

  const chordsLength = selectedChords.length;

  return (
    <div>
      <Button
        className="mt-2"
        variant="secondary"
        size="xs"
        onClick={() => setIsModalOpen(true)}
      >
        Set guitar riff
      </Button>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <DialogPanel className="-mt-20 w-3/4 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-medium mb-4">Pick your chords</h2>
          <div className="flex flex-wrap gap-2 mt-4 h-[135px] overflow-auto p-1 pr-3 mb-4">
            {CHORDS.map((chord) => (
              <Button
                size="xs"
                key={chord}
                variant="secondary"
                onClick={() => setChord(chord)}
              >
                {chord}
              </Button>
            ))}
          </div>

          <div className="mb-4">
            <div className="flex justify-between mb-3">
              <h3 className="font-medium mb-1">Selected Chords:</h3>
              {chordsLength ? (
                <Button
                  onClick={() => setSelectedChords(selectedChords.slice(0, -1))}
                  className="flex justify-between items-center"
                  variant="danger"
                  size="xs"
                >
                  <BackspaceIcon className="size-3 mr-2" />
                  Remove
                </Button>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              {chordsLength ? (
                selectedChords.map((chord: (typeof CHORDS)[number], index) => (
                  <div
                    key={`chord-${index}`}
                    className="inline-block text-sm/4 bg-gray-200 p-1 rounded"
                  >
                    {chord}
                    <button
                      onClick={() => handleRemoveChord(index)}
                      className="ml-1 text-red-500"
                    >
                      &times;
                    </button>
                  </div>
                ))
              ) : (
                <p>No chords selected</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              className="mr-2"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button disabled={!chordsLength} onClick={handleSave}>
              Save
            </Button>
          </div>
        </DialogPanel>
      </Dialog>
    </div>
  );
}
