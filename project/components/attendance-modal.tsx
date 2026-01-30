'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { updateAttendance } from '@/app/actions'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2 } from 'lucide-react'
import type { DelegateClient, Attendance } from '@/lib/types'

interface AttendanceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  delegate: DelegateClient | null
}

export function AttendanceModal({ open, onOpenChange, delegate }: AttendanceModalProps) {
  const [day1, setDay1] = useState(delegate?.attendance.day1 ?? false)
  const [day2, setDay2] = useState(delegate?.attendance.day2 ?? false)
  const [day3, setDay3] = useState(delegate?.attendance.day3 ?? false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSave = async () => {
    if (!delegate) return

    setIsSubmitting(true)
    try {
      const attendance: Attendance = { day1, day2, day3 }
      const result = await updateAttendance(delegate._id, attendance)

      if (result.success) {
        toast.success(`Attendance updated for ${delegate.delegate_name}`)
        onOpenChange(false)
      } else {
        toast.error(result.error || 'Failed to update attendance')
      }
    } catch (error) {
      toast.error('An error occurred')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!delegate) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Attendance — {delegate.delegate_name} (Team {delegate.team_id})
          </DialogTitle>
          <DialogDescription>
            Mark attendance for each day
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Checkbox
              id="day1"
              checked={day1}
              onCheckedChange={(checked) => setDay1(checked as boolean)}
              disabled={isSubmitting}
            />
            <label htmlFor="day1" className="text-sm font-medium cursor-pointer">
              Day 1
            </label>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="day2"
              checked={day2}
              onCheckedChange={(checked) => setDay2(checked as boolean)}
              disabled={isSubmitting}
            />
            <label htmlFor="day2" className="text-sm font-medium cursor-pointer">
              Day 2
            </label>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="day3"
              checked={day3}
              onCheckedChange={(checked) => setDay3(checked as boolean)}
              disabled={isSubmitting}
            />
            <label htmlFor="day3" className="text-sm font-medium cursor-pointer">
              Day 3
            </label>
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
