import { getAllNotes } from "@/actions/notes";
import NotesContainer from "@/containers/notes-container";
import { Prisma } from "@prisma/client";

export default async function NotesPage() {
  const notes: Prisma.NoteGetPayload<{ include: { user: true } }>[] | false =
    await getAllNotes();

  if (notes) return <NotesContainer notes={notes} />;
  return null; // Handle the false case
}
