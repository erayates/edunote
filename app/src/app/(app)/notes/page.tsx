import { getAllNotes, searchNotes } from "@/actions/notes";
import NotesContainer from "@/containers/notes-container";
import { notFound } from "next/navigation";

interface SearchParams {
  search?: string;
  tags?: string[];
  author?: string;
  createdAt?: string;
  page?: number;
}

interface NotesPageProps {
  searchParams: SearchParams;
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const { search, tags, author, createdAt, page = 1 } = searchParams;

  const searchResult = await searchNotes({
    query: search,
    tags: Array.isArray(tags) ? tags : tags ? [tags] : undefined,
    author,
    createdAt: createdAt ? new Date(createdAt) : undefined,
    page: Number(page), // Ensure it's a number
    limit: 12, // Match the LIMIT in NotePagination
  });

  if (searchResult) {
    return (
      <NotesContainer
        notes={searchResult.notes}
        totalNotes={searchResult.totalNotes}
      />
    );
  }

  return notFound();
}
