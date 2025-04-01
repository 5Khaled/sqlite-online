import { useMemo } from "react";
import { useDatabaseStore } from "@/store/useDatabaseStore";
import { useDatabaseWorker } from "@/providers/DatabaseWorkerProvider";
import { usePanelManager } from "@/providers/PanelProvider";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Span } from "@/components/ui/span";
import ColumnIcon from "@/components/table/ColumnIcon";
import FilterInput from "@/components/table/FilterInput";

import { FilterXIcon } from "lucide-react";
import SorterButton from "../table/SorterButton";

const DataTable = () => {
  const data = useDatabaseStore((state) => state.data);
  const columns = useDatabaseStore((state) => state.columns);
  const currentTable = useDatabaseStore((state) => state.currentTable);
  const tablesSchema = useDatabaseStore((state) => state.tablesSchema);
  const filters = useDatabaseStore((state) => state.filters);
  const setFilters = useDatabaseStore((state) => state.setFilters);

  const { handleQueryFilter } = useDatabaseWorker();
  const { handleRowClick } = usePanelManager();

  const emptyDataContent = useMemo(
    () => (
      <div className="flex h-full flex-col items-center justify-center gap-1 px-4">
        {filters ? (
          <>
            <p className="text-md font-medium">
              No Data To Show For Current Filters
            </p>
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => setFilters(null)}
            >
              <FilterXIcon className="mr-1 h-3 w-3" />
              Clear filters
            </Button>
          </>
        ) : (
          <>
            <p className="text-md font-medium">No Data To Show</p>
            <p className="text-sm">
              This table does not have any data to display
            </p>
          </>
        )}
      </div>
    ),
    [filters, setFilters]
  );

  const memoizedFilterInput = useMemo(() => {
    return (columns || []).map((column) => (
      <FilterInput
        key={column}
        column={column}
        value={filters?.[column] || ""}
        onChange={handleQueryFilter}
      />
    ));
  }, [columns, filters, handleQueryFilter]);

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-primary/5">
          {columns && currentTable ? (
            columns.map((column, index) => (
              <TableHead key={column} className="p-1 text-xs">
                <div className="flex items-center gap-1 py-[1.5px]">
                  <SorterButton column={column} />
                  <Span className="text-foreground font-medium capitalize">
                    {column}
                  </Span>
                  <ColumnIcon
                    columnSchema={tablesSchema[currentTable].schema[index]}
                  />
                </div>
                {memoizedFilterInput?.[index]}
              </TableHead>
            ))
          ) : (
            <TableHead>
              <p className="text-xs">No columns found</p>
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data && data.length > 0 ? (
          data.map((row, i) => {
            const displayData = row.slice(1);
            return (
              <TableRow
                key={i}
                onClick={() => handleRowClick(displayData, i, row[0])}
                className="hover:bg-primary/5 focus:bg-primary/5 cursor-pointer text-xs"
              >
                {displayData.map((value, j) => (
                  <TableCell key={j} className="p-2">
                    {value ? (
                      <>
                        {tablesSchema[currentTable!].schema[j]?.type ===
                        "BLOB" ? (
                          <span className="text-muted-foreground italic">
                            BLOB
                          </span>
                        ) : (
                          <Span>{value}</Span>
                        )}
                      </>
                    ) : (
                      <span className="text-muted-foreground italic">
                        {value === null ? "NULL" : JSON.stringify(value)}
                      </span>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns?.length || 1}
              className="h-32 text-center"
            >
              {emptyDataContent}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default DataTable;
