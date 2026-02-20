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

  // Gunakan Intl.NumberFormat - lebih simple dan powerful
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(num)
}

// Generate table row dengan consistent styling - dipakai di preview dan saat kirim email
function generateTableRow(no: number, invoice: string, nilai: string, diskon: string): string {
  return `<tr>
    <td style="border: 1px solid #e5e7eb; text-align: center;">${no}</td>
    <td style="border: 1px solid #e5e7eb; text-align: center;">${invoice}</td>
    <td style="border: 1px solid #e5e7eb; text-align: right;">${formatCurrency(nilai)}</td>
    <td style="border: 1px solid #e5e7eb; text-align: right;">${formatCurrency(diskon)}</td>
  </tr>`
}

export function getEmailTemplate(): string {
  return `<div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; padding: 20px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <!-- Logo placeholder -->
  </div>

  <h2 style="color: #0f172a;">Notifikasi Keringanan Biaya Layanan</h2>

  <p>Yth. <strong>{{NamaPerusahaan}}</strong></p>
  <p>di Tempat</p>

  <p>Dengan hormat,</p>

  <p>Merujuk pada Surat Edaran PT Terminal Petikemas Surabaya Nomor PS.04.02/5/1/1/B3.2.1/A/TPSS-26 tentang Kebijakan Pemberian Keringanan Pelayanan Jasa Periode Natal Tahun 2025 dan Tahun Baru 2026 di PT Terminal Petikemas Surabaya, bersama ini kami sampaikan bahwa <strong>{{NamaPerusahaan}}</strong> termasuk dalam perusahaan yang memperoleh keringanan kebijakan penumpukan dimaksud, dengan rincian sebagai berikut:</p>

  <table style="width: 80%; border-collapse: collapse;">
    <colgroup>
      <col style="width: 10%;" />
      <col style="width: 40%;" />
      <col style="width: 25%;" />
      <col style="width: 25%;" />
    </colgroup>
    <thead>
      <tr style="background-color: #f3f4f6;">
        <th style="border: 1px solid #e5e7eb; text-align: left;">No</th>
        <th style="border: 1px solid #e5e7eb; text-align: center;">Invoice</th>
        <th style="border: 1px solid #e5e7eb; text-align: right;">Nilai</th>
        <th style="border: 1px solid #e5e7eb; text-align: right;">Nilai Diskon</th>
      </tr>
    </thead>
    <tbody>
      ${generateTableRow(1, '{{Invoice}}', '{{Nilai}}', '{{NilaiDiskon}}')}
    </tbody>
    <tfoot>
      <tr style="background-color: #f9fafb; font-weight: bold;">
        <td colspan="2" style="border: 1px solid #e5e7eb;">Total</td>
        <td style="border: 1px solid #e5e7eb; text-align: right;">{{TotalNilai}}</td>
        <td style="border: 1px solid #e5e7eb; text-align: right;">{{TotalDiskon}}</td>
      </tr>
    </tfoot>
  </table>

  <p>Adapun total nilai keringanan sebagaimana tersebut di atas akan direstitusikan ke rekening perusahaan sesuai data pembayaran berikut:</p>

  <p>
    <strong>Nomor Rekening:</strong> {{NoRekening}}<br/>
    <strong>Nama Bank:</strong> {{NamaBank}}<br/>
    <strong>Nama Pemegang Rekening:</strong> {{NamaPemegangRek}}
  </p>

  <p>Sehubungan dengan hal tersebut, mohon kiranya dapat dilakukan konfirmasi atas kesesuaian data rekening dimaksud agar proses restitusi dapat segera kami tindak lanjuti. Konfirmasi dimaksud agar disampaikan melalui surat pernyataan dalam bentuk hard copy yang telah ditandatangani dan dibubuhi meterai.</p>

  <p>Demikian disampaikan. Atas perhatian dan kerja samanya, kami ucapkan terima kasih.</p>

  <p>Hormat kami,<br/>
  <strong>Terminal Petikemas Surabaya</strong></p>

  <hr style="margin: 20px 0;" />

  <p style="font-size: 12px; color: #64748b;">
    Email ini dikirim otomatis oleh sistem TPS.<br/>
    Mohon tidak membalas email ini.
  </p>
</div>`
}

// Export generateTableRow untuk dipakai di file lain
export { generateTableRow }

// HTML helper untuk tombol "Tabel Invoice" di editor
export function getInvoiceTableHelperHTML(): string {
  return `<table style="width: 80%; border-collapse: collapse;">
    <colgroup>
      <col style="width: 10%;" />
      <col style="width: 40%;" />
      <col style="width: 25%;" />
      <col style="width: 25%;" />
    </colgroup>
  <thead>
    <tr style="background-color: #f3f4f6;">
      <th style="border: 1px solid #e5e7eb; text-align: left;">No</th>
      <th style="border: 1px solid #e5e7eb; text-align: center;">Invoice</th>
      <th style="border: 1px solid #e5e7eb; text-align: right;">Nilai</th>
      <th style="border: 1px solid #e5e7eb; text-align: right;">Nilai Diskon</th>
    </tr>
  </thead>
  <tbody>
    ${generateTableRow(1, '{{Invoice}}', '{{Nilai}}', '{{NilaiDiskon}}')}
  </tbody>
  <tfoot>
    <tr style="background-color: #f9fafb; font-weight: bold;">
      <td colspan="2" style="border: 1px solid #e5e7eb;">Total</td>
      <td style="border: 1px solid #e5e7eb; text-align: right;">{{TotalNilai}}</td>
      <td style="border: 1px solid #e5e7eb; text-align: right;">{{TotalDiskon}}</td>
    </tr>
  </tfoot>
</table>`
}

// Config untuk mapping kolom CSV ke table - Single source of truth
export const COLUMN_MAPPING = {
  invoice: (colName: string) => /invoice/i.test(colName),
  nilai: (colName: string) => /nilai/i.test(colName) && !/diskon/i.test(colName),
  diskon: (colName: string) => /diskon/i.test(colName)
} as const

// Check apakah required columns exist di column keys
export function hasInvoiceColumns(columnKeys: string[]): boolean {
  const hasInvoice = columnKeys.some(k => COLUMN_MAPPING.invoice(k))
  const hasNilai = columnKeys.some(k => COLUMN_MAPPING.nilai(k))
  const hasDiskon = columnKeys.some(k => COLUMN_MAPPING.diskon(k))

  return hasInvoice && hasNilai && hasDiskon
}

// Cari column keys berdasarkan mapping
export function findColumnKeys(columnKeys: string[]) {
  return {
    invoice: columnKeys.filter(k => COLUMN_MAPPING.invoice(k)),
    nilai: columnKeys.filter(k => COLUMN_MAPPING.nilai(k)),
    diskon: columnKeys.filter(k => COLUMN_MAPPING.diskon(k))
  }
}

