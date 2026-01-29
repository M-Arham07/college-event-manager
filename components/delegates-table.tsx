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
import { Trash2 } from "lucide-react"
import { AttendanceCheckbox } from "./attendance-checkbox"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"
import type { DelegateClient } from "@/lib/types"

interface DelegatesTableProps {
  delegates: DelegateClient[]
  totalCount: number
}

export function DelegatesTable({ delegates, totalCount }: DelegatesTableProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedDelegate, setSelectedDelegate] = useState<DelegateClient | null>(null)

  const handleDeleteClick = (delegate: DelegateClient) => {
    setSelectedDelegate(delegate)
    setDeleteModalOpen(true)
  }

  const getTeamMemberCount = (teamId: number) => {
    return delegates.filter((d) => d.team_id === teamId).length
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
                  {delegate.delegate_name}
                </TableCell>
                <TableCell>
                  {delegate.category ? (
                    <Badge variant="outline">{delegate.category}</Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <AttendanceCheckbox
                    id={delegate._id}
                    attendance={delegate.attendance}
                  />
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

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        delegate={selectedDelegate}
        teamMemberCount={selectedDelegate ? getTeamMemberCount(selectedDelegate.team_id) : 0}
        onDeleteSuccess={() => {
          setSelectedDelegate(null)
          // Parent component will handle data refresh through revalidatePath
        }}
      />
    </div>
  )
}
