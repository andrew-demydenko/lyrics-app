import { axiosWrapper } from "@/lib/axios";
import { TSong } from "@/types/song";

export const getSharedSongs = async (): Promise<TSong[]> => {
  const response = await axiosWrapper.get("/songs/shared");

  return response.data;
};

export const getUserSongs = async (userId: string): Promise<TSong[]> => {
  const response = await axiosWrapper.get(`/songs/user/${userId}`);

  return response.data;
};

export const getSongById = async (id: string): Promise<TSong | null> => {
  if (!id) {
    throw new Error("Song ID is required");
  }
  try {
    const response = await axiosWrapper.get(`/songs/${id}`);

    try {
      response.data.chordPositions = JSON.parse(response.data.chords);
    } catch (e) {
      console.error("Error parsing chords", e);
    }

    return response.data;
  } catch (e) {
    return null;
  }
};

export const deleteSong = async (id: string) => {
  const response = await axiosWrapper.delete(`/songs/${id}`);

  return response.data;
};
