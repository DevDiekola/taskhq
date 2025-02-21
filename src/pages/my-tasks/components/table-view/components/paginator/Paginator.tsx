import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type PaginationProps = {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  pageSizeOptions?: number[];
};

const Paginator: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handlePageSizeChange = (size: string) => {
    const newSize = parseInt(size, 10);
    onPageSizeChange(newSize);
    onPageChange(1);
  };

  return (
    <div className={"flex flex-col md:flex-row items-center justify-between"}>
      <div className="flex items-center gap-5 mt-7">
        <span className="text-sm">Show</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="px-5">
              {pageSize}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-52">
            <DropdownMenuRadioGroup
              value={`${pageSize}`}
              onValueChange={handlePageSizeChange}
            >
              {pageSizeOptions.map((size) => (
                <DropdownMenuRadioItem key={size} value={`${size}`}>
                  {size}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <span className="text-sm">entries</span>
      </div>

      <span className="mt-7">
        Showing page {currentPage} of {totalPages}
      </span>

      <div className="flex items-center gap-2 mt-7">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Paginator;
