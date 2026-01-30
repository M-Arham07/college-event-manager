"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, Crown } from "lucide-react"
import { AttendanceModal } from "./attendance-modal"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"
import type { DelegateClient } from "@/lib/types"
import { AttendanceCheckbox } from "./attendance-checkbox" // Import AttendanceCheckbox

interface DelegatesTableProps {
  delegates: DelegateClient[]
  totalCount: number
}

export function DelegatesTable({ delegates, totalCount }: DelegatesTableProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false)
  const [selectedDelegate, setSelectedDelegate] = useState<DelegateClient | null>(null)

  const handleDeleteClick = (delegate: DelegateClient) => {
    setSelectedDelegate(delegate)
    setDeleteModalOpen(true)
  }

  const handleAttendanceClick = (delegate: DelegateClient) => {
    setSelectedDelegate(delegate)
    setAttendanceModalOpen(true)
  }

  const getTeamMemberCount = (teamId: number) => {
    return delegates.filter((d) => d.team_id === teamId).length
  }

  const getAttendanceStatus = (delegate: DelegateClient) => {
    const isPresent = delegate.attendance.day1 && delegate.attendance.day2 && delegate.attendance.day3
    return isPresent
  }
  if (delegates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 py-16">
        <p className="text-muted-foreground">No delegates found.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your filters or search terms.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="text-sm text-muted-foreground">
        Showing {delegates.length} of {totalCount} delegates
      </div>
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-[100px]">Team</TableHead>
              <TableHead>Delegate Name</TableHead>
              <TableHead className="w-[150px]">Category</TableHead>
              <TableHead className="w-[140px]">Attendance</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {delegates.map((delegate) => (
              <TableRow key={delegate._id} className="border-border">
                <TableCell>
                  <Badge variant="secondary" className="font-mono">
                    Team {delegate.team_id}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    {delegate.delegate_name}
                    {delegate.isHead && (
                      <Crown className="h-4 w-4 text-green-600 animate-pulse" aria-label="Head delegate" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {delegate.category ? (
                    <Badge variant="outline">{delegate.category}</Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAttendanceClick(delegate)}
                    >
                      Attendance
                    </Button>
                    <Badge
                      className={`font-bold ${
                        getAttendanceStatus(delegate)
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                    >
                      {getAttendanceStatus(delegate) ? "P" : "A"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(delegate)}
                    className="h-8 w-8 p-0 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AttendanceModal
        open={attendanceModalOpen}
        onOpenChange={setAttendanceModalOpen}
        delegate={selectedDelegate}
      />

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        delegate={selectedDelegate}
        teamMemberCount={selectedDelegate ? getTeamMemberCount(selectedDelegate.team_id) : 0}
        onDeleteSuccess={() => {
          setSelectedDelegate(null)
        }}
      />
    </div>
  )
}
