'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { deleteDelegate, deleteTeam } from '@/app/actions-delete'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, AlertCircle } from 'lucide-react'
import type { DelegateClient } from '@/lib/types'

interface DeleteConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  delegate: DelegateClient | null
  teamMemberCount: number
  onDeleteSuccess?: () => void
}

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  delegate,
  teamMemberCount,
  onDeleteSuccess,
}: DeleteConfirmationModalProps) {
  const [deleteWholeTeam, setDeleteWholeTeam] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  if (!delegate) return null

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      let result

      if (deleteWholeTeam) {
        result = await deleteTeam(delegate.team_id)
      } else {
        result = await deleteDelegate(delegate._id)
      }

      if (result.success) {
        const count = result.deletedCount || 1
        const message = count === 1 ? 'Deleted 1 delegate' : `Deleted ${count} delegates`
        toast.success(message)
        onOpenChange(false)
        setDeleteWholeTeam(false)
        onDeleteSuccess?.()
      } else {
        toast.error(result.error || 'Failed to delete')
      }
    } catch (error) {
      console.error('Error deleting:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsDeleting(false)
    }
  }

  const delegateSummary = deleteWholeTeam
    ? `${teamMemberCount} ${teamMemberCount === 1 ? 'delegate' : 'delegates'} will be deleted.`
    : '1 delegate will be deleted.'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Delete delegate
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Context info */}
          <div className="rounded-lg bg-card border border-border p-3">
            <p className="text-sm text-muted-foreground">
              Delegate: <span className="font-semibold text-foreground">{delegate.delegate_name}</span> • Team {delegate.team_id}
            </p>
          </div>

          {/* Summary */}
          <div className="rounded-lg bg-destructive/10 p-3">
            <p className="text-sm font-medium text-destructive">
              {delegateSummary}
            </p>
          </div>

          {/* Checkbox to delete whole team */}
          {teamMemberCount > 1 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="delete-whole-team"
                  checked={deleteWholeTeam}
                  onCheckedChange={(checked) => setDeleteWholeTeam(checked as boolean)}
                  disabled={isDeleting}
                />
                <label htmlFor="delete-whole-team" className="text-sm font-medium cursor-pointer">
                  Delete whole team instead
                </label>
              </div>
              <p className="text-xs text-muted-foreground ml-6">
                This will delete all {teamMemberCount} delegates in Team {delegate.team_id}
              </p>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex gap-3 justify-end pt-4">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false)
              setDeleteWholeTeam(false)
            }}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="gap-2"
          >
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isDeleting ? 'Deleting...' : 'Confirm Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
