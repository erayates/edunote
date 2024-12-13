import { searchNotes } from "@/actions/notes";
import NotesContainer from "@/containers/notes-container";
import { notFound } from "next/navigation";

interface SearchParams {
  search?: string;
  tags?: string;
  author?: string;
  createdAt?: string;
  page?: number;
}

interface NotesPageProps {
  searchParams: Promise<SearchParams>;
}

const LIMIT = 12;

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const { search, tags, author, createdAt, page = 1 } = await searchParams;

  const searchResult = await searchNotes({
    query: search,
    tags: tags,
    author,
    createdAt: createdAt ? new Date(createdAt) : undefined,
    page: Number(page),
    limit: LIMIT,
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
