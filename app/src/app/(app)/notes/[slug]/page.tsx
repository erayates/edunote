import { fetchNoteWithSharelink, fetchSingleNote } from "@/actions/notes";
import EdunoteEditor from "@/components/editor/editor";
import Spinner from "@/components/ui/spinner";
import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function NoteSlugContainer({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;

  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const { share_link } = await searchParams;

  const user = await currentUser();

  if (user) {
    // Check is a note that will be fetch with share_link
    if (share_link) {
      const sharedNote = await fetchNoteWithSharelink(String(share_link));
      if (sharedNote) {
        return (
          <Suspense fallback={<Spinner />}>
            <EdunoteEditor note={sharedNote} settingsOff={true} />
          </Suspense>
        );
      }
    }

    if (slug) {
      const note = await fetchSingleNote(slug);
      if (note) {
        // Check this note's owner is current user or not
        if (note.userId === user.id) {
          return (
            <Suspense fallback={<Spinner />}>
              <EdunoteEditor note={note} />
            </Suspense>
          );
        }

        return (
          <Suspense fallback={<Spinner />}>
            <EdunoteEditor note={note} settingsOff={true} />
          </Suspense>
        );
      }
    }

    return notFound();
  }

  return <div></div>;
}
