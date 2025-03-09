import Sqlite from "./lib/sqlite";

let instance: Sqlite | null = null;

interface WorkerEvent {
  action: string;
  payload?: any; // TODO: Remove any
}

self.onmessage = async (event: MessageEvent<WorkerEvent>) => {
  const { action, payload } = event.data;
  try {
    switch (action) {
      case "init": {
        // Create a new database instance
        instance = await Sqlite.create();
        self.postMessage({
          action: "initComplete",
          payload: {
            tableSchema: instance.tablesSchema,
            indexSchema: instance.indexesSchema,
            currentTable: instance.firstTable,
          },
        });
        break;
      }
      case "openFile": {
        // Create a new database instance from the uploaded file
        instance = await Sqlite.open(new Uint8Array(payload.file));
        self.postMessage({
          action: "initComplete",
          payload: {
            tableSchema: instance.tablesSchema,
            indexSchema: instance.indexesSchema,
            currentTable: instance.firstTable,
          },
        });
        break;
      }
      case "refresh": {
        // Refresh the data of the current table
        if (instance) {
          const [results, maxSize] = instance.getTableData(
            payload.currentTable,
            payload.page,
            payload.filters,
            payload.sorters
          );
          self.postMessage({
            action: "queryComplete",
            payload: { results, maxSize },
          });
        } else {
          self.postMessage({
            action: "queryError",
            payload: { error: "No database loaded" },
          });
        }
        break;
      }
      case "exec": {
        // Execute a SQL query (could be multiple statements)
        if (instance) {
          const [results, doTablesChanged] = instance.exec(payload.query);
          // If the structure changed, update tables and schema
          if (doTablesChanged) {
            self.postMessage({
              action: "updateInstance",
              payload: {
                tableSchema: instance.tablesSchema,
                indexSchema: instance.indexesSchema,
              },
            });
          } else {
            // If it is a SELECT statement return the results
            if (results.length > 0) {
              // TODO: return isCustomQuery
              self.postMessage({
                action: "queryComplete",
                payload: { results },
              });
            }
            // If it is an INSERT/UPDATE/DELETE statement, return the updated data
            else {
              // Update data after executing a new SQL statement
              const [results, maxSize] = instance.getTableData(
                payload.currentTable,
                payload.page,
                payload.filters,
                payload.sorters
              );
              self.postMessage({
                action: "queryComplete",
                payload: { results, maxSize },
              });
            }
          }
        } else {
          self.postMessage({
            action: "queryError",
            payload: { error: "No database loaded" },
          });
        }
        break;
      }
      case "getTableData": {
        // Retrieve paginated data for a table
        if (instance) {
          const { currentTable, page, filters, sorters } = payload;
          const [results, maxSize] = instance.getTableData(
            currentTable,
            page,
            filters,
            sorters
          );
          self.postMessage({
            action: "queryComplete",
            payload: { results, maxSize },
          });
        } else {
          self.postMessage({
            action: "queryError",
            payload: { error: "No database loaded" },
          });
        }
        break;
      }
      case "download": {
        // Download the database
        if (instance) {
          const bytes = instance.download();
          self.postMessage({
            action: "downloadComplete",
            payload: { bytes },
          });
        }
        break;
      }
      case "update": {
        // Update the values of a row in a table
        if (instance) {
          const { table, columns, values, whereValues } = payload;
          instance.update(table, columns, values, whereValues);
          self.postMessage({
            action: "updateComplete",
          });
        }
        break;
      }
      case "delete": {
        // Delete a row from a table
        if (instance) {
          const { table, columns, values } = payload;
          instance.delete(table, columns, values);
          self.postMessage({
            action: "updateComplete",
          });
        }
        break;
      }
      case "export": {
        // Export the data of a table as CSV
        if (instance) {
          const { table, filters, sorters, page, exportType } = payload;
          let results: string;
          if (exportType === "table") results = instance.getTableAsCsv(table);
          else
            results = instance.getCurrentDataAsCsv(
              table,
              page,
              filters,
              sorters
            );
          self.postMessage({
            action: "exportComplete",
            payload: { results },
          });
        }
        break;
      }
      default:
        console.warn("Unknown worker action:", action);
    }
  } catch (error) {
    if (error instanceof Error)
      self.postMessage({
        action: "queryError",
        payload: { error: error },
      });
    else
      self.postMessage({
        action: "queryError",
        payload: { error: "Unknown error" },
      });
  }
};
