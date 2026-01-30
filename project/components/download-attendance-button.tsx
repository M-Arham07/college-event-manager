'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { generateAttendanceSheet } from '@/lib/pdf-generator'
import type { DelegateDTO } from '@/app/api/delegates/route'

export function DownloadAttendanceButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    try {
      setIsLoading(true)

      // Fetch delegates as JSON
      const response = await fetch('/api/delegates')
      if (!response.ok) {
        throw new Error('Failed to fetch delegates')
      }

      const delegates: DelegateDTO[] = await response.json()

      if (delegates.length === 0) {
        toast.error('No delegates found')
        return
      }

      // Generate PDF locally
      await generateAttendanceSheet(delegates)

      toast.success('Attendance sheet downloaded')
    } catch (error) {
      console.error('Error downloading attendance sheet:', error)
      toast.error('Failed to download attendance sheet')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className="h-9 gap-2 bg-transparent"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Download Attendance Sheet
        </>
      )}
    </Button>
  )
}
