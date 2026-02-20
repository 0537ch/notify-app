'use client'

import { useState, useMemo, useRef } from 'react'
import { getEmailTemplate, generateTableRow, getInvoiceTableHelperHTML, findColumnKeys, hasInvoiceColumns, formatCurrency } from '@/lib/email-template'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Table, List, Type, Image } from 'lucide-react'

interface EmailTemplateEditorProps {
  variables: string[]
  onSave?: (template: string) => void
  defaultTemplate?: string
  sampleData?: Record<string, any>
  sampleRows?: any[]
  subject?: string
  onSubjectChange?: (subject: string) => void
  ccEmails?: string
  onCcEmailsChange?: (emails: string) => void
}

export function EmailTemplateEditor({ variables, onSave, defaultTemplate, sampleData, sampleRows = [], subject = '', onSubjectChange, ccEmails = '', onCcEmailsChange }: EmailTemplateEditorProps) {
  const [template, setTemplate] = useState(defaultTemplate || getDefaultTemplate())
  const [showHelpers, setShowHelpers] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Generate preview with sample data
  const preview = useMemo(() => {
    let result = template

    // Helper to find column value dynamically
    const findValue = (row: any, possibleKeys: string[]) => {
      for (const key of possibleKeys) {
        if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
          return row[key]
        }
      }
      return ''
    }

    // Helper to find numeric value
    const findNumericValue = (row: any, possibleKeys: string[]) => {
      const value = findValue(row, possibleKeys)
      if (typeof value === 'number') return value
      if (typeof value === 'string') {
        return parseFloat(value.replace(/[Rp.\s]/g, '')) || 0
      }
      return 0
    }

    // Generate table rows if sampleRows are available
    if (sampleRows.length > 0 && hasInvoiceColumns(variables)) {
      // Find columns using single source of truth
      const columnKeys = findColumnKeys(variables)

      const tableRows = sampleRows.map((row, idx) => {
        const invoice = findValue(row, columnKeys.invoice)
        const nilai = findValue(row, columnKeys.nilai)
        const diskon = findValue(row, columnKeys.diskon)

        return generateTableRow(idx + 1, invoice, formatCurrency(String(nilai)), formatCurrency(String(diskon)))
      }).join('')

      // Calculate totals
      const totalNilai = sampleRows.reduce((sum: number, row: any) => {
        return sum + findNumericValue(row, columnKeys.nilai)
      }, 0)

      const totalDiskon = sampleRows.reduce((sum: number, row: any) => {
        return sum + findNumericValue(row, columnKeys.diskon)
      }, 0)

      // Only replace tbody if it contains variables (not empty)
      const tbodyMatch = result.match(/<tbody>([\s\S]*?)<\/tbody>/)
      if (tbodyMatch && tbodyMatch[1].trim() !== '' && (tbodyMatch[1].includes('{{') || tbodyMatch[1].includes('<td'))) {
        result = result.replace(/<tbody>[\s\S]*?<\/tbody>/, `<tbody>${tableRows}</tbody>`)
      }

      // Replace totals
      result = result.replace(/{{TotalNilai}}/g, formatCurrency(totalNilai))
      result = result.replace(/{{TotalDiskon}}/g, formatCurrency(totalDiskon))
    }

    // Replace all variables with sample data (both inside and outside tables)
    variables.forEach(variable => {
      const value = sampleData?.[variable] || getPlaceholder(variable)
      result = result.replace(new RegExp(`{{${variable}}}`, 'g'), String(value))
    })

    return result
  }, [template, variables, sampleData, sampleRows])

  function insertAtCursor(text: string) {
    const textarea = textareaRef.current
    if (!textarea) {
      setTemplate(prev => prev + text)
      return
    }

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newValue = template.substring(0, start) + text + template.substring(end)

    setTemplate(newValue)

    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + text.length, start + text.length)
    }, 0)
  }

  function insertVariable(variable: string) {
    insertAtCursor(variable)
  }

  function insertHTML(html: string) {
    insertAtCursor(html)
  }

  const helpers = [
    {
      label: 'Tabel Invoice',
      icon: Table,
      html: getInvoiceTableHelperHTML()
    },
    {
      label: 'Bold Text',
      icon: Type,
      html: `<strong>Teks bold</strong>`
    },
    {
      label: 'Italic Text',
      icon: Type,
      html: `<em>Teks italic</em>`
    },
    {
      label: 'List',
      icon: List,
      html: `<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>`
    },
    {
      label: 'Paragraph',
      icon: Type,
      html: `<p>Paragraph baru...</p>`
    },
    {
      label: 'Gambar',
      icon: Image,
      html: `<img src="" alt="Gambar" style="max-width: 200px;" />`
    }
  ]

  function handleSave() {
    onSave?.(template)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Editor */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Email Template</CardTitle>
          <CardDescription>
            Tulis template surat email. Gunakan {'{{variabel}}'} untuk menyisipkan data dari CSV.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-1">
          {/* Available Variables */}
          <div>
            <p className="text-sm font-medium mb-3">Available Variables:</p>
            <div className="flex flex-wrap gap-2">
              {variables.map(variable => (
                <Button
                  key={variable}
                  variant="outline"
                  size="sm"
                  onClick={() => insertVariable(`{{${variable}}}`)}
                  className="font-mono text-xs"
                >
                  {`{{${variable}}}`}
                </Button>
              ))}
            </div>
            {variables.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                Upload CSV dulu untuk melihat variabel yang tersedia
              </p>
            )}
          </div>

          {/* Subject Input */}
          {onSubjectChange && (
            <div>
              <label className="text-sm font-medium mb-2 block">
                Subject Email:
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => onSubjectChange(e.target.value)}
                placeholder="Subject email..."
                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          )}

          {/* CC Email Input */}
          {onCcEmailsChange && (
            <div>
              <label className="text-sm font-medium mb-2 block">
                CC Emails (optional):
              </label>
              <input
                type="text"
                value={ccEmails}
                onChange={(e) => onCcEmailsChange(e.target.value)}
                placeholder="email1@example.com, email2@example.com"
                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Pisahkan email dengan koma. Email ini akan menerima CC untuk semua email yang dikirim.
              </p>
            </div>
          )}

          {/* HTML Helper Buttons */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Insert HTML Cepat:</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHelpers(!showHelpers)}
                className="text-xs"
              >
                {showHelpers ? 'Sembunyikan' : 'Tampilkan'}
              </Button>
            </div>
            {showHelpers && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-muted/30 rounded-md border">
                {helpers.map((helper) => (
                  <Button
                    key={helper.label}
                    variant="outline"
                    size="sm"
                    onClick={() => insertHTML(helper.html)}
                    className="text-xs h-auto py-2 flex flex-col items-start gap-1"
                  >
                    <helper.icon className="h-4 w-4" />
                    <span>{helper.label}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Template Editor */}
          <div className="flex-1 flex flex-col">
            <label className="text-sm font-medium mb-2 block">
              Template (HTML):
            </label>
            <textarea
              ref={textareaRef}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              placeholder="Tulis template HTML di sini... Gunakan tombol di atas untuk menyisipkan variabel"
              className="flex-1 w-full min-h-[500px] px-3 py-2 text-sm font-mono border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-y"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-2">
            <Button onClick={handleSave}>
              Save Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            Preview email dengan sample data
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div
            className="border rounded-lg p-8 prose prose-sm max-w-none overflow-auto bg-white"
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function getDefaultTemplate(): string {
  return getEmailTemplate()
}

function getPlaceholder(variable: string): string {
  const placeholders: Record<string, string> = {
    'NamaPerusahaan': 'PT Semoga Banyak Duit',
    'NoRekening': '1234567890',
    'NamaBank': 'Bank Mandiri',
    'NamaPemegangRek': 'Surya Ganm',
    'Email': 'rio@example.com',
    'Invoice': 'INV-001',
    'Nilai': 'Rp 1.000.000',
    'NilaiDiskon': 'Rp 100.000',
    'TotalNilai': 'Rp 3.000.000',
    'TotalDiskon': 'Rp 300.000'
  }

  return placeholders[variable] || `[${variable}]`
}
