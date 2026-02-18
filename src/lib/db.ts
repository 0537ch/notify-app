import postgres from 'postgres'

let sql: postgres.Sql<Record<string, never>> | null = null

export function getDb() {
  if (!sql) {
    const url = process.env.DATABASE_URL
    if (!url) {
      throw new Error('DATABASE_URL environment variable is not set')
    }
    sql = postgres(url, {
      prepare: false,
      ssl: process.env.DATABASE_SSL as any,
    })
  }

  return sql
}

export function resetDbConnection() {
  if (sql) {
    sql.end({ timeout: 5 })
    sql = null
  }
}

export type Import = {
  id: number
  file_name: string
  is_active: boolean
  uploaded_at: Date
}

export type Row = {
  id: number
  import_id: number
  data: Record<string, any>  // JSONB stored as object
  created_at: Date
}

export type RowWithImport = Row & {
  file_name: string
}
