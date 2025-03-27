import { create } from "zustand";
import type { TableSchema } from "@/types";

interface SchemaState {
  expandedTables: string[];
  expandedTableSection: boolean;
  expandedIndexSection: boolean;
  toggleTable: (tableName: string) => void;
  toggleTableSection: () => void;
  toggleIndexSection: () => void;
  expandAllTables: (tableSchema: TableSchema) => void;
  collapseAllTables: () => void;
}

export const useSchemaStore = create<SchemaState>((set) => ({
  expandedTables: [],
  expandedTableSection: true,
  expandedIndexSection: true,

  toggleTable: (tableName: string) =>
    set((state) => ({
      expandedTables: state.expandedTables.includes(tableName)
        ? state.expandedTables.filter((name) => name !== tableName)
        : [...state.expandedTables, tableName]
    })),

  toggleTableSection: () =>
    set((state) => ({
      expandedTableSection: !state.expandedTableSection
    })),

  toggleIndexSection: () =>
    set((state) => ({
      expandedIndexSection: !state.expandedIndexSection
    })),

  expandAllTables: (tableSchema: TableSchema) =>
    set({
      expandedTables: Object.keys(tableSchema)
    }),

  collapseAllTables: () =>
    set({
      expandedTables: []
    })
}));
