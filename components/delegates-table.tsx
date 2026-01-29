"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AttendanceCheckbox } from "./attendance-checkbox"
import type { DelegateClient } from "@/lib/types"

interface DelegatesTableProps {
  delegates: DelegateClient[]
  totalCount: number
}

export function DelegatesTable({ delegates, totalCount }: DelegatesTableProps) {
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
