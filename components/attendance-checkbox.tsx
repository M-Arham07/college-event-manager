"use client"

import { useState, useTransition } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { toggleAttendance } from "@/app/actions"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface AttendanceCheckboxProps {
  id: string
  attendance: boolean
}

export function AttendanceCheckbox({ id, attendance }: AttendanceCheckboxProps) {
  const [isPending, startTransition] = useTransition()
  const [optimisticAttendance, setOptimisticAttendance] = useState(attendance)

  const handleToggle = (checked: boolean) => {
    const previousValue = optimisticAttendance
    setOptimisticAttendance(checked)

    startTransition(async () => {
      const result = await toggleAttendance(id, checked)
      if (!result.success) {
        setOptimisticAttendance(previousValue)
        toast.error("Failed to update attendance", {
          description: result.error || "Please try again.",
        })
      } else {
        toast.success(checked ? "Marked as present" : "Marked as absent")
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      {isPending ? (
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      ) : (
        <Checkbox
          checked={optimisticAttendance}
          onCheckedChange={handleToggle}
          disabled={isPending}
          aria-label="Toggle attendance"
        />
      )}
      <span
        className={`text-sm ${
          optimisticAttendance ? "text-success" : "text-muted-foreground"
        }`}
      >
        {optimisticAttendance ? "Present" : "Absent"}
      </span>
    </div>
  )
}
