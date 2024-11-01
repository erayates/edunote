import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";

const LIMIT = 10;
const MAX_PAGES_SHOWN = 7;

export default function NotePagination({
  totalNotes,
  currentPage,
  setCurrentPage,
}: {
  totalNotes: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}) {
  // Use the search params to initialize current page
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(totalNotes / LIMIT);

  const router = useRouter();

  const getPageNumbers = () => {
    // Improved page number generation logic
    if (totalPages <= MAX_PAGES_SHOWN) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pageRange = MAX_PAGES_SHOWN - 2; // Accounting for first, last, and ellipses
    if (currentPage <= Math.ceil(pageRange / 2)) {
      // Near the beginning
      return [
        ...Array.from({ length: pageRange }, (_, i) => i + 1),
        0, // Ellipsis
        totalPages,
      ];
    } else if (currentPage >= totalPages - Math.floor(pageRange / 2)) {
      // Near the end
      return [
        1,
        0, // Ellipsis
        ...Array.from(
          { length: pageRange },
          (_, i) => totalPages - pageRange + i + 1
        ),
      ];
    } else {
      // Middle pages
      const halfRange = Math.floor(pageRange / 2);
      return [
        1,
        0, // First ellipsis
        ...Array.from(
          { length: pageRange },
          (_, i) => currentPage - halfRange + i
        ),
        0, // Second ellipsis
        totalPages,
      ];
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("page", currentPage.toString());
    router.replace(`/notes?${params.toString()}`, { scroll: false });
  }, [currentPage, searchParams, router]);

  // Prevent invalid page changes
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Disable buttons when at page limits
  const isPreviousDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage - 1);
            }}
            className={`
                ${isPreviousDisabled ? "pointer-events-none opacity-50" : ""}
                
              `}
          />
        </PaginationItem>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => {
          if (page === 0) {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis
                  onClick={(e) => {
                    e.preventDefault();
                    // Improved jumping logic
                    const jumpAmount = MAX_PAGES_SHOWN - 2;
                    handlePageChange(
                      index === 1
                        ? Math.max(1, currentPage - jumpAmount)
                        : Math.min(totalPages, currentPage + jumpAmount)
                    );
                  }}
                  className="cursor-pointer"
                />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page);
                }}
                className={`
                    ${
                      page === currentPage
                        ? "underline"
                        : "text-white/80 hover:text-white/90"
                    } 
                  `}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage + 1);
            }}
            className={`
                ${isNextDisabled ? "pointer-events-none opacity-50" : ""}
                
              `}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
