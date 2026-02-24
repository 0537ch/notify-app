export function formatCurrency(value: number | string): string {
  if (typeof value === 'string' && value.includes('Rp')) {
    return value
  }

  let num: number
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^\d.-]/g, '')
    num = parseFloat(cleaned) || 0
  } else {
    num = value
  }

  if (num === 0) {
    return '0'
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(num)
}

export function getEmailTemplate(): string {
  return `<div style="font-family: Arial, Helvetica, sans-serif; max-width: 800px; margin: auto; border: 1px solid #e5e7eb; padding: 20px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <!-- Logo placeholder -->
  </div>

  <h2 style="color: #0f172a;">Notifikasi Keringanan Biaya Layanan</h2>

  <p>Yth. <strong>{{Customer Name}} [{{Customer Master}}]</strong></p>
  <p>di Tempat</p>

  <p>Dengan hormat,</p>

  <p>Merujuk pada Surat Edaran PT Terminal Petikemas Surabaya Nomor PS.04.02/5/1/1/B3.2.1/A/TPSS-26 tentang Kebijakan Pemberian Keringanan Pelayanan Jasa Periode Natal Tahun 2025 dan Tahun Baru 2026 di PT Terminal Petikemas Surabaya, bersama ini kami sampaikan bahwa <strong>{{Customer Name}} [{{Customer Master}}]</strong> termasuk dalam perusahaan yang memperoleh keringanan kebijakan penumpukan dimaksud, dengan rincian sebagai berikut:</p>

  <div style="overflow-x: auto;">
  <table style="width: 100%; min-width: 600px; border-collapse: collapse;">
    <thead>
      <tr style="background-color: #f3f4f6;">
        <th style="border: 1px solid #e5e7eb; text-align: center;">No</th>
        <th style="border: 1px solid #e5e7eb; text-align: center;">No Job Order</th>
        <th style="border: 1px solid #e5e7eb; text-align: center;">No Invoice</th>
        <th style="border: 1px solid #e5e7eb; text-align: center;">Invoice To</th>
        <th style="border: 1px solid #e5e7eb; text-align: right;">Nilai Invoice</th>
        <th style="border: 1px solid #e5e7eb; text-align: right;">Nilai Diskon</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px solid #e5e7eb; text-align: center;">{{No}}</td>
        <td style="border: 1px solid #e5e7eb; text-align: center;">{{No Job Order}}</td>
        <td style="border: 1px solid #e5e7eb; text-align: center;">{{No Invoice}}</td>
        <td style="border: 1px solid #e5e7eb; text-align: left;">{{Invoice To}}</td>
        <td style="border: 1px solid #e5e7eb; text-align: right;">{{Nilai Invoice}}</td>
        <td style="border: 1px solid #e5e7eb; text-align: right;">{{Nilai Diskon}}</td>
      </tr>
    </tbody>
    <tfoot>
      <tr style="background-color: #f9fafb; font-weight: bold;">
        <td style="border: 1px solid #e5e7eb; text-align: right;">Total</td>
        <td style="border: 1px solid #e5e7eb;"></td>
        <td style="border: 1px solid #e5e7eb;"></td>
        <td style="border: 1px solid #e5e7eb;"></td>
        <td style="border: 1px solid #e5e7eb; text-align: right;">{{TotalNilai}}</td>
        <td style="border: 1px solid #e5e7eb; text-align: right;">{{TotalDiskon}}</td>
      </tr>
    </tfoot>
  </table>
  </div>

  <p>Adapun total nilai keringanan sebagaimana tersebut di atas akan direstitusikan ke rekening perusahaan sesuai data pembayaran berikut:</p>

  <p>
    <strong>Nomor Rekening:</strong> {{No Rekening}}<br/>
    <strong>Nama Bank:</strong> {{Nama Bank}}<br/>
    <strong>Nama Pemegang Rekening:</strong> {{Invoice To}}
  </p>

  <p>Sehubungan dengan hal tersebut, mohon kiranya dapat dilakukan konfirmasi atas kesesuaian data rekening dimaksud agar proses restitusi dapat segera kami tindak lanjuti. Konfirmasi dimaksud agar disampaikan melalui dokumen berikut:</p>

  <ol>
    <li>Scan Surat Permohonan pembayaran restitusi dalam bentuk hard copy yang telah ditandatangani dan dibubuhi meterai.</li>
    <li>Scan Buku Rekening / Rekening Koran</li>
    <li>Scan NPWP Perusahaan</li>
  </ol>

  <p><em>Nb: Semua dokumen berformat PDF</em></p>

  <p>Demikian disampaikan. Atas perhatian dan kerja samanya, kami ucapkan terima kasih.</p>

  <p>Permohonan ini paling lambat kami terima tanggal <strong>1 Maret 2026</strong></p>

  <p>Transfer Restitusi akan terproses estimasi selama <strong>21 Hari Kerja</strong></p>

  <p>Hormat kami,<br/>
  <strong>Terminal Petikemas Surabaya</strong></p>

  <hr style="margin: 20px 0;" />

  <p style="font-size: 12px; color: #64748b;">
    Email ini dikirim otomatis oleh sistem TPS.<br/>
    Mohon tidak membalas email ini.
  </p>
</div>`
}

export function getInvoiceTableHelperHTML(): string {
  return `<div style="overflow-x: auto;">
<table style="width: 100%; min-width: 600px; border-collapse: collapse;">
  <thead>
    <tr style="background-color: #f3f4f6;">
      <th style="border: 1px solid #e5e7eb; text-align: center;">No</th>
      <th style="border: 1px solid #e5e7eb; text-align: center;">No Job Order</th>
      <th style="border: 1px solid #e5e7eb; text-align: center;">No Invoice</th>
      <th style="border: 1px solid #e5e7eb; text-align: center;">Invoice To</th>
      <th style="border: 1px solid #e5e7eb; text-align: right;">Nilai Invoice</th>
      <th style="border: 1px solid #e5e7eb; text-align: right;">Nilai Diskon</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #e5e7eb; text-align: center;">{{No}}</td>
      <td style="border: 1px solid #e5e7eb; text-align: center;">{{No Job Order}}</td>
      <td style="border: 1px solid #e5e7eb; text-align: center;">{{No Invoice}}</td>
      <td style="border: 1px solid #e5e7eb; text-align: left;">{{Invoice To}}</td>
      <td style="border: 1px solid #e5e7eb; text-align: right;">{{Nilai Invoice}}</td>
      <td style="border: 1px solid #e5e7eb; text-align: right;">{{Nilai Diskon}}</td>
    </tr>
  </tbody>
  <tfoot>
    <tr style="background-color: #f9fafb; font-weight: bold;">
      <td style="border: 1px solid #e5e7eb; text-align: right;">Total</td>
      <td style="border: 1px solid #e5e7eb;"></td>
      <td style="border: 1px solid #e5e7eb;"></td>
      <td style="border: 1px solid #e5e7eb;"></td>
      <td style="border: 1px solid #e5e7eb; text-align: right;">{{TotalNilai}}</td>
      <td style="border: 1px solid #e5e7eb; text-align: right;">{{TotalDiskon}}</td>
    </tr>
  </tfoot>
</table>
</div>`
}

export function extractVariablesFromTemplate(template: string): string[] {
  const matches = template.match(/\{\{([^}]+)\}\}/g) || []
  return matches.map(m => m.replace(/\{\{|\}\}/g, '').trim())
}

export function hasInvoiceColumns(columnKeys: string[]): boolean {
  return columnKeys.length > 0
}

export function tbodyHasVariable(template: string, variablePattern: RegExp): boolean {
  const tbodyMatch = template.match(/<tbody>([\s\S]*?)<\/tbody>/i)
  if (!tbodyMatch) return false

  const tbodyContent = tbodyMatch[1]
  return variablePattern.test(tbodyContent)
}

export function findTotalVariables(template: string): {
  nilaiVariables: string[]
  diskonVariables: string[]
} {
  const allVariables = extractVariablesFromTemplate(template)
  const nilaiVariables = allVariables.filter(v => /nilai/i.test(v))
  const diskonVariables = allVariables.filter(v => /diskon/i.test(v))

  return { nilaiVariables, diskonVariables }
}

export function calculateTotalFromRows(
  rows: Record<string, any>[],
  variables: string[]
): number {
  return rows.reduce((sum, row) => {
    let rowTotal = 0
    for (const variable of variables) {
      const value = row[variable]
      if (value) {
        const numValue = parseFloat(String(value).replace(/[^\d.-]/g, '')) || 0
        rowTotal += numValue
      }
    }
    return sum + rowTotal
  }, 0)
}

export interface TBodyCell {
  content: string
  alignment: 'left' | 'center' | 'right'
  isRowNumber: boolean
}

export function extractTBodyTemplate(template: string): {
  cells: TBodyCell[]
  rawHtml: string
} | null {
  const tbodyMatch = template.match(/<tbody>([\s\S]*?)<\/tbody>/i)
  if (!tbodyMatch) return null

  const tbodyContent = tbodyMatch[1].trim()

  const trMatch = tbodyContent.match(/<tr[^>]*>([\s\S]*?)<\/tr>/i)
  if (!trMatch) return null

  const tdMatches = trMatch[1].match(/<td[^>]*>([\s\S]*?)<\/td>/gi)
  if (!tdMatches) return null

  const cells = tdMatches.map(td => {
    const contentMatch = td.match(/<td[^>]*>([\s\S]*?)<\/td>/i)
    const content = contentMatch ? contentMatch[1].trim() : ''

    const alignMatch = td.match(/text-align:\s*(left|center|right)/i)
    const alignment = alignMatch ? alignMatch[1].toLowerCase() as 'left' | 'center' | 'right' : 'left'

    const isRowNumber = /^\{\{\s*no\.?\s*\}\}$/i.test(content)

    return { content, alignment, isRowNumber }
  })

  return { cells, rawHtml: tbodyContent }
}

export function renderTemplate(
  template: string,
  rowData: Record<string, any>
): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (match, variableName) => {
    const trimmedVar = variableName.trim()
    const value = rowData[trimmedVar]

    if (value === undefined || value === null) {
      return match
    }

    if (/nilai|diskon|total/i.test(trimmedVar)) {
      return formatCurrency(value)
    }

    return String(value)
  })
}

export function generateTableRowFromTemplate(
  row: Record<string, any>,
  tbodyTemplate: { cells: TBodyCell[] },
  rowNo: number
): string {
  const cells = tbodyTemplate.cells.map(cell => {
    let content = cell.content

    if (cell.isRowNumber) {
      content = String(rowNo)
    } else {
      content = renderTemplate(content, row)
    }

    return `<td style="border: 1px solid #e5e7eb; text-align: ${cell.alignment};">${content}</td>`
  })

  return `<tr>${cells.join('')}</tr>`
}

