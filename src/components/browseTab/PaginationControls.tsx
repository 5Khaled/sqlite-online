import { useDatabaseWorker } from "@/providers/DatabaseWorkerProvider";
import { useDatabaseStore } from "@/store/useDatabaseStore";
import { usePanelManager } from "@/providers/PanelProvider";

import { Button } from "@/components/ui/button";

import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FolderOutputIcon,
  PlusIcon
} from "lucide-react";

const PaginationControls = () => {
  const { handlePageChange, handleExport } = useDatabaseWorker();
  const { isInserting, handleInsert } = usePanelManager();
  const offset = useDatabaseStore((state) => state.offset);
  const limit = useDatabaseStore((state) => state.limit);
  const maxSize = useDatabaseStore((state) => state.maxSize);
  const isDataLoading = useDatabaseStore((state) => state.isDataLoading);

  return (
    <footer
      className="bg-background flex w-full items-center justify-between border-t"
      id="paginationControls"
    >
      <section className="bg-primary/10 flex grow items-center gap-1 p-2">
        <Button
          onClick={() => handlePageChange("first")}
          disabled={offset === 0 || isDataLoading}
          size="icon"
          variant="outline"
          className="h-7 w-7"
          title="Go to the first data"
        >
          <ChevronFirstIcon className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => handlePageChange("prev")}
          disabled={offset === 0 || isDataLoading}
          size="icon"
          variant="outline"
          className="h-7 w-7"
          title="Go to the previous data"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <span className="px-2 text-xs whitespace-nowrap">
          {offset + 1}
          {" -> "}
          {offset + limit > maxSize ? maxSize : offset + limit} of {maxSize}
        </span>
        <Button
          onClick={() => handlePageChange("next")}
          disabled={offset + limit >= maxSize || isDataLoading}
          size="icon"
          variant="outline"
          className="h-7 w-7"
          title="Go to the next data"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => handlePageChange("last")}
          disabled={offset + limit >= maxSize || isDataLoading}
          size="icon"
          variant="outline"
          className="h-7 w-7"
          title="Go to the last data"
        >
          <ChevronLastIcon className="h-4 w-4" />
        </Button>
      </section>
      <section className="bg-primary/10 hidden items-center gap-1 p-2 md:flex">
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs"
          onClick={handleInsert}
          disabled={isInserting}
        >
          <PlusIcon className="mr-1 h-3 w-3" />
          Insert row
        </Button>
        <Button
          onClick={() => handleExport("current")}
          size="sm"
          variant="outline"
          className="h-7 text-xs"
          title="Export current data as CSV"
        >
          <FolderOutputIcon className="mr-1 h-3 w-3" />
          Export data
        </Button>
      </section>
    </footer>
  );
};

export default PaginationControls;
