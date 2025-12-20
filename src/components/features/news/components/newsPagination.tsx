import { Button } from "@/components/ui/button";

interface NewsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}

export const NewsPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  scrollRef,
}: NewsPaginationProps) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    onPageChange(page);
    scrollRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-2 mt-8">
      <div className="flex gap-5">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
          if (pageNum > totalPages) return null;
          
          return (
            <Button
              key={pageNum}
              className="md:text-md text-sm"
              variant={pageNum === currentPage ? "default" : "outline"}
              onClick={() => handlePageChange(pageNum)}
            >
              {pageNum}
            </Button>
          );
        })}
      </div>

      <div className="flex gap-7">
        <Button
          className="bg-black text-white p-2 md:text-md text-sm"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          className="text-white bg-black p-2 px-4 md:text-md text-sm"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};