import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Note } from "@prisma/client";
import { useState } from "react";

export default function NotePagination({ notes }: { notes: Note[] }) {
  const [page, setPage] = useState(1);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            className="bg-sky-400 hover:bg-sky-600 text-white rounded-full"
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href="#"
            className="bg-sky-400 hover:bg-sky-600 text-white rounded-full"
          >
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href="#"
            className="bg-sky-400 hover:bg-sky-600 text-white rounded-full"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
