// ---- Schema ----

export type TableSchema = Record<
  string, // Table name
  {
    primaryKey: "_rowid_" | string;
    schema: TableSchemaRow[];
  }
>;

export type TableSchemaRow = {
  name: string; // Column name
  cid: number;
  type: string | null;
  dflt_value: string;
  IsNullable: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
};

export type IndexSchema = {
  name: string;
  tableName: string;
};

// ---- State ----

export type Sorters = Record<string, "asc" | "desc">;
export type Filters = Record<string, string>;
