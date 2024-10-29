import { getAllNotes, searchNotes } from "@/actions/notes";
import NotesContainer from "@/containers/notes-container";
import { NoteWithRelations } from "@/types/note";
import { notFound } from "next/navigation";

interface SearchParams {
  search?: string;
  tags?: string[];
  author?: string;
  createdAt?: string;
  take?: string;
}

interface NotesPageProps {
  searchParams: SearchParams;
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const { search, tags, author, createdAt, take } = searchParams;

  try {
    const hasSearchParams = Object.values(searchParams).some(
      (param) => param !== undefined
    );

    let notes: NoteWithRelations[] = [];

    if (hasSearchParams) {
      const searchResult = await searchNotes({
        query: search,
        tags: Array.isArray(tags) ? tags : tags ? [tags] : undefined,
        author,
        createdAt: createdAt ? new Date(createdAt) : undefined,
        take: take ? parseInt(take, 10) : undefined,
      });

      if (searchResult) {
        notes = searchResult;
      }
    } else {
      const _take = take ? parseInt(take, 10) : undefined;
      const allNotes = await getAllNotes(_take as number);
      if (allNotes) {
        notes = allNotes;
      }
    }

    return <NotesContainer notes={notes} />;
  } catch (error) {
    console.error("Error fetching notes:", error);
    return notFound();
  }
}
