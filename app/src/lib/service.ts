import { GEMINI_API_HISTORY_URL } from "./constants";

export const getChatHistory = async (userId: string, noteId: string) => {
  try {
    const response = await fetch(
      `${GEMINI_API_HISTORY_URL}?user_id=${userId as string}&note_id=${noteId}`
    );

    return await response.json();
  } catch {
    return false;
  }
};
