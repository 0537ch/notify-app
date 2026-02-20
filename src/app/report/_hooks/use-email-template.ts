import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { generateTableRow, findColumnKeys, hasInvoiceColumns, formatCurrency } from '@/lib/email-template'

// Constants
const MAX_ROWS_PER_SEND = 1000
const MAX_EMAILS_PER_BATCH = 100

// HTML escape function to prevent XSS
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

interface EmailData {
  sender: string
  to: string[]
  cc?: string[]
  subject: string
  message: string
}

export function useEmailTemplate(people: Array<any>, columnKeys: string[]) {
  const [sending, setSending] = useState(false)
  const [templateModalOpen, setTemplateModalOpen] = useState(false)
  const [hasSent, setHasSent] = useState(false) // Track if already sent

  // Group data by email for sending
  const groupedByEmail = useMemo(() => {
    const groups = new Map<string, any[]>()

    // Validate: Check if we have data
    if (!people || people.length === 0) {
      return groups
    }

    // Validate: Detect email column
    const emailColumn = columnKeys.find(key =>
      people.some(person => {
        const data = person.data || person
        const val = data[key]
        return typeof val === 'string' && val.includes('@') && val.trim() !== ''
      })
    )

    if (!emailColumn) {
      console.error('❌ No email column found in CSV data')
      console.error('Available columns:', columnKeys)
      return groups // Return empty map - no emails can be sent
    }

    console.log('✅ Email column detected:', emailColumn)

    people.forEach(person => {
      // Check if this is already grouped (has _childRows)
      if (person._childRows && person._childRows.length > 0) {
        // This is a grouped row from flattenedData
        const data = person as any
        const emailColumn = columnKeys.find(key =>
          String(data[key]).includes('@')
        )

        if (emailColumn) {
          const email = data[emailColumn] as string
          // Validate: Skip empty or invalid emails
          if (!email || !email.includes('@') || email.trim() === '') {
            console.warn('⚠️ Skipping invalid email:', email)
            return
          }
          if (!groups.has(email)) {
            groups.set(email, data._childRows)
          }
        }
      } else {
        // This is raw data from people array
        const data = person.data || person
        const emailColumn = columnKeys.find(key =>
          String(data[key]).includes('@')
        )

        if (emailColumn) {
          const email = data[emailColumn] as string
          // Validate: Skip empty or invalid emails
          if (!email || !email.includes('@') || email.trim() === '') {
            console.warn('⚠️ Skipping invalid email:', email)
            return
          }

          if (!groups.has(email)) {
            groups.set(email, [])
          }

          groups.get(email)!.push(data)
        }
      }
    })

    return groups
  }, [people, columnKeys])

  async function sendEmails(template: string, subjectTemplate: string, ccEmailsString?: string) {
    if (!template || template.trim() === '') {
      toast.error('Template tidak boleh kosong')
      return
    }

    if (!subjectTemplate || subjectTemplate.trim() === '') {
      toast.error('Subject tidak boleh kosong')
      return
    }

    // Validate: Check if there are emails to send
    if (groupedByEmail.size === 0) {
      toast.error('Tidak ada email yang bisa dikirim', {
        description: 'CSV tidak punya kolom email atau tidak ada data valid'
      })
      return
    }

    // Prevent duplicate sends
    if (sending) {
      toast.warning('Email sedang dikirim', {
        description: 'Mohon tunggu proses selesai'
      })
      return
    }

    // Check if any selected rows already have status 'success'
    const alreadySentRows = people.filter(p => p.notification_status === 'success')
    if (alreadySentRows.length > 0) {
      toast.warning('Beberapa data sudah pernah dikirim', {
        description: `${alreadySentRows.length} rows sudah status 'Success'. Kirim ulang?`
      })
      // Note: We allow sending, but warn user first
    }

    // Validate row count
    if (people.length > MAX_ROWS_PER_SEND) {
      toast.error('Terlalu banyak rows untuk dikirim', {
        description: `Maksimal ${MAX_ROWS_PER_SEND} rows per kirim. Current: ${people.length} rows`
      })
      return
    }

    // Validate email count
    if (groupedByEmail.size > MAX_EMAILS_PER_BATCH) {
      toast.error('Terlalu banyak email untuk dikirim', {
        description: `Maksimal ${MAX_EMAILS_PER_BATCH} email per batch. Current: ${groupedByEmail.size} email`
      })
      return
    }

    setSending(true)
    setHasSent(false)

    try {
      // Use Next.js API proxy to avoid CORS
      const emailPromises = Array.from(groupedByEmail.entries()).map(
        async ([email, rows]) => {
          const rowIds = rows.map((r: any) => r.id)

          const firstRow = rows[0]

          // Replace variables in template (dynamic)
          let emailContent = template

          // Generate invoice table rows if columns exist
          if (hasInvoiceColumns(columnKeys)) {
            const keys = findColumnKeys(columnKeys)

            // Calculate totals
            const totalNilai = rows.reduce((sum: number, row: any) => {
              let nilai = 0
              for (const key of keys.nilai) {
                const val = parseFloat(String(row[key] || 0).replace(/[Rp.\s]/g, '')) || 0
                nilai += val
              }
              return sum + nilai
            }, 0)

            const totalDiskon = rows.reduce((sum: number, row: any) => {
              let diskon = 0
              for (const key of keys.diskon) {
                const val = parseFloat(String(row[key] || 0).replace(/[Rp.\s]/g, '')) || 0
                diskon += val
              }
              return sum + diskon
            }, 0)

            // Replace totals (special variables)
            emailContent = emailContent
              .replace(/{{TotalNilai}}/g, escapeHtml(formatCurrency(totalNilai)))
              .replace(/{{TotalDiskon}}/g, escapeHtml(formatCurrency(totalDiskon)))

            // Generate table rows
            const tableRows = rows.map((row: any, idx: number) => {
              const invoice = keys.invoice.map(k => row[k]).find(v => v) || ''
              const nilai = keys.nilai.map(k => row[k]).find(v => v) || ''
              const diskon = keys.diskon.map(k => row[k]).find(v => v) || ''

              return generateTableRow(
                idx + 1,
                escapeHtml(String(invoice)),
                formatCurrency(String(nilai)),
                formatCurrency(String(diskon))
              )
            }).join('')

            // Replace table body placeholder
            emailContent = emailContent.replace(
              /<tbody>[\s\S]*?<\/tbody>/,
              `<tbody>${tableRows}</tbody>`
            )
          }

          // Replace all other variables dynamically from firstRow
          columnKeys.forEach(key => {
            // Skip table variables (already handled above)
            if (/invoice|nilai|diskon|total/i.test(key)) return

            const value = firstRow[key] || ''
            // Escape HTML to prevent XSS
            const safeValue = escapeHtml(String(value))
            emailContent = emailContent.replace(
              new RegExp(`{{${key}}}`, 'g'),
              safeValue
            )
          })

          // Replace variables in subject
          let emailSubject = subjectTemplate
          columnKeys.forEach(key => {
            const value = firstRow[key] || ''
            // Escape HTML to prevent XSS (though subject is plain text, still good practice)
            const safeValue = escapeHtml(String(value))
            emailSubject = emailSubject.replace(
              new RegExp(`{{${key}}}`, 'g'),
              safeValue
            )
          })


          const emailData: EmailData = {
            sender: process.env.NEXT_PUBLIC_EMAIL_SENDER!,
            to: [email],
            cc: ccEmailsString && ccEmailsString.trim() !== '' ? [ccEmailsString] : undefined,
            subject: emailSubject,
            message: emailContent
          }

          console.log('📤 Sending to:', email)
          console.log('📧 Subject:', emailSubject)

          try {
            // Get token from localStorage
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

            // Send to proxy API (avoid CORS)
            const response = await fetch('/api/email/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
              },
              body: JSON.stringify(emailData)
            })

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
              console.error(`❌ Failed to send to ${email}:`, errorData)

              // Update status to failed
              try {
                await fetch('/api/notifications', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    rowIds,
                    status: 'failed',
                    error: errorData.error || 'Failed to send email'
                  })
                })
              } catch (statusErr) {
                console.error('⚠️ Failed to update failed status:', statusErr)
                // Log inconsistency but don't throw - email already failed anyway
              }

              throw new Error(errorData.error || `Failed to send to ${email}`)
            }

            const responseData = await response.json()
            console.log(`✅ Success sending to ${email}:`, responseData)

            // Update status to success
            try {
              await fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  rowIds,
                  status: 'success'
                })
              })
            } catch (statusErr) {
              // CRITICAL: Email sent but status update failed
              console.error('⚠️ INCONSISTENCY: Email sent but status update failed!', statusErr)
              console.error(`⚠️ Rows affected: ${rowIds.join(', ')}`)
              console.error('⚠️ Please manually update these rows to status: success')

              // Don't throw - email was successfully sent
              // Return success but note the inconsistency
              return { email, success: true, statusUpdateFailed: true }
            }

            return { email, success: true }
          } catch (err: any) {
            // Update status to failed
            try {
              await fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  rowIds,
                  status: 'failed',
                  error: err.message
                })
              })
            } catch (statusErr) {
              console.error('⚠️ Failed to update failed status:', statusErr)
              // Don't throw - we already have the main error
            }
            throw err
          }
        }
      )

      const results = await Promise.all(emailPromises)

      const successCount = results.filter(r => r.success).length
      console.log(`\n🎉 ===== EMAIL SENDING COMPLETE =====`)
      console.log(`✅ Success: ${successCount}/${groupedByEmail.size}`)

      toast.success(`Email berhasil dikirim ke ${successCount} penerima`, {
        description: `Total: ${groupedByEmail.size} alamat email`,
        duration: 5000
      })

      setTemplateModalOpen(false)
    } catch (error) {
      console.error('❌ Error sending emails:', error)
      toast.error(error instanceof Error ? error.message : 'Gagal mengirim email. Silakan coba lagi.', {
        duration: 5000
      })
    } finally {
      setSending(false)
    }
  }

  return {
    sending,
    templateModalOpen,
    setTemplateModalOpen,
    groupedByEmail,
    sendEmails
  }
}
