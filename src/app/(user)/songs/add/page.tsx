import SongForm from "../components/song-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Song creation",
};

function AddSongPage() {
  return (
    <div className="h-full overflow-auto">
      <SongForm />
    </div>
  );
}

export default AddSongPage;
