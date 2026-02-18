'use client'

import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, PaginationState } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useInvoiceData, useRowSelection, useNotifications, downloadTemplate, type Row } from '../_hooks/use-report'

export default function InvoiceTable() {
  const invoiceData = useInvoiceData()
  const selection = useRowSelection(invoiceData.people)
  const notifications = useNotifications(selection.selectedPeople, selection.setRowSelection)

  const { people, imports, selectedImportId, setSelectedImportId, loading, error, uploading, selectedFile, setSelectedFile, fileInputRef, handleFileUpload, handleImport, handleDeleteImport } = invoiceData
  const { rowSelection, setRowSelection, selectedPeople } = selection
  const { notificationDialogOpen, setNotificationDialogOpen, sending, handleSendNotifications } = notifications

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })

  const flattenedData = useMemo(() => {
    return people.map(person => ({
      ...person,
      ...person.data
    }))
  }, [people])

  const columnKeys = useMemo(() => {
    if (flattenedData.length === 0) return []
    const keys = new Set<string>()
    flattenedData.forEach(person => {
      Object.keys(person).forEach(key => {
        if (key !== 'id' && key !== 'created_at' && key !== 'data') {
          keys.add(key)
        }
      })
    })
    return Array.from(keys)
  }, [flattenedData])

  const columns = useMemo<ColumnDef<typeof flattenedData[number]>[]>(() => {
    const cols: ColumnDef<Row>[] = [
      {
        id: 'select',
        size: 50,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label='Select all'
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label='Select row'
          />
        )
      }
    ]

    columnKeys.forEach(key => {
      cols.push({
        id: key,
        accessorFn: (row: any) => row[key],
        header: key,
        cell: ({ getValue }) => {
          const value = getValue() as string | number | null
          return <div>{value ?? ''}</div>
        }
      })
    })

    return cols
  }, [columnKeys])

  const table = useReactTable({
    data: flattenedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      rowSelection,
      pagination
    }
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* pilih file */}
      {imports.length > 0 && (
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium whitespace-nowrap">Select File:</label>
          <select
            value={selectedImportId ?? ''}
            onChange={(e) => setSelectedImportId(e.target.value ? parseInt(e.target.value) : null)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-sm"
          >
            {imports.map((imp) => (
              <option key={imp.id} value={imp.id}>
                {imp.file_name} ({new Date(imp.uploaded_at).toLocaleDateString()})
              </option>
            ))}
          </select>
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            ({people.length} rows)
          </span>
        </div>
      )}

      {/* tombol upload */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left side - Send Notification button */}
        <Dialog open={notificationDialogOpen} onOpenChange={setNotificationDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={selectedPeople.length === 0} className="w-full sm:w-auto">
              Kirim {selectedPeople.length > 0 && `(${selectedPeople.length})`}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Send Notifications</DialogTitle>
              <DialogDescription>
                Kirim Notifikasi ke {selectedPeople.length} {selectedPeople.length === 1 ? 'orang' : 'orang'}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columnKeys.map(key => (
                      <TableHead key={key}>{key}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedPeople.map((person) => (
                    <TableRow key={person.id}>
                      {columnKeys.map(key => (
                        <TableCell key={key}>
                          {person.data[key]?.toString() ?? ''}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setNotificationDialogOpen(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={handleSendNotifications} disabled={sending} className="w-full sm:w-auto">
                {sending ? 'Sending...' : 'Send Notifications'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />

          {!selectedFile ? (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex-1 sm:flex-none">
                Upload File
              </Button>
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" disabled={!selectedImportId} className="flex-1 sm:flex-none">
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Import</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this import? This action cannot be undone and will remove all {people.length} rows.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="w-full sm:w-auto">
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        if (selectedImportId) {
                          setDeleting(true)
                          await handleDeleteImport(selectedImportId)
                          setDeleting(false)
                          setDeleteDialogOpen(false)
                        }
                      }}
                      disabled={deleting}
                      className="w-full sm:w-auto"
                    >
                      {deleting ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
              <div className="text-sm text-muted-foreground truncate px-2 py-1 bg-muted rounded flex-1 sm:flex-none sm:max-w-48">
                {selectedFile.name}
              </div>
              <Button onClick={handleImport} disabled={uploading} className="flex-1 sm:flex-none">
                {uploading ? 'Importing...' : 'Import'}
              </Button>
              <Button variant="outline" onClick={() => setSelectedFile(null)} disabled={uploading} className="flex-1 sm:flex-none">
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {people.length === 0 ? (
        <div className="text-center p-12 text-gray-500">
          No data yet. Import a CSV or XLSX file to get started.
        </div>
      ) : (
        <>
          <div className='rounded-md border overflow-x-auto'>
            <Table className='min-w-150'>
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id} className='hover:bg-transparent'>
                    {headerGroup.headers.map(header => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className='h-24 text-center'>
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-2">
            <div className="text-sm text-muted-foreground">
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
              {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} of{' '}
              {table.getFilteredRowModel().rows.length} row(s)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                {'<<'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {'<'}
              </Button>
              <div className="text-sm">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {'>'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                {'>>'}
              </Button>
            </div>
          </div>
        </>
      )}
      </div>
  )
}
