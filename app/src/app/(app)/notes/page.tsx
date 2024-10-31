import { getAllNotes, searchNotes } from "@/actions/notes";
import NotesContainer from "@/containers/notes-container";
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

  const hasSearchParams = Object.values(searchParams).some(
    (param) => param !== undefined
  );

  if (hasSearchParams) {
    const searchResult = await searchNotes({
      query: search,
      tags: Array.isArray(tags) ? tags : tags ? [tags] : undefined,
      author,
      createdAt: createdAt ? new Date(createdAt) : undefined,
      take: take ? parseInt(take, 10) : undefined,
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

  const _take = take ? parseInt(take, 10) : undefined;
  const { notes, totalNotes } = await getAllNotes(_take as number);
  if (notes) {
    return <NotesContainer notes={notes} totalNotes={totalNotes} />;
  }

  return notFound();
}
