'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { addDelegation } from '@/app/actions-delegation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2 } from 'lucide-react'

interface AddDelegationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  nextTeamId: number
}

export function AddDelegationModal({ open, onOpenChange, nextTeamId }: AddDelegationModalProps) {
  const [delegate1Name, setDelegate1Name] = useState('')
  const [delegate2Name, setDelegate2Name] = useState('')
  const [delegate3Name, setDelegate3Name] = useState('')
  const [category, setCategory] = useState('')
  const [includeDelegate2, setIncludeDelegate2] = useState(true)
  const [includeDelegate3, setIncludeDelegate3] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!delegate1Name.trim()) {
      newErrors.delegate1 = 'Delegate 1 name is required'
    }

    if (includeDelegate2 && !delegate2Name.trim()) {
      newErrors.delegate2 = 'Delegate 2 name is required when included'
    }

    if (includeDelegate3 && !delegate3Name.trim()) {
      newErrors.delegate3 = 'Delegate 3 name is required when included'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleReset = () => {
    setDelegate1Name('')
    setDelegate2Name('')
    setDelegate3Name('')
    setCategory('')
    setIncludeDelegate2(true)
    setIncludeDelegate3(true)
    setErrors({})
  }

  const handleCancel = () => {
    handleReset()
    onOpenChange(false)
  }

  const handleConfirm = async () => {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const result = await addDelegation({
        delegate_1_name: delegate1Name,
        delegate_2_name: delegate2Name,
        delegate_3_name: delegate3Name,
        category: category || null,
        include_delegate_2: includeDelegate2,
        include_delegate_3: includeDelegate3,
      })

      if (result.success) {
        toast.success(`Delegation added! ${result.insertedCount} delegate(s) inserted to Team ${result.teamId}`)
        handleReset()
        onOpenChange(false)
      } else {
        toast.error(result.error || 'Failed to add delegation')
      }
    } catch (error) {
      console.error('Error adding delegation:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isDelegate1Valid = delegate1Name.trim().length > 0
  const isDelegate2Valid = !includeDelegate2 || delegate2Name.trim().length > 0
  const isDelegate3Valid = !includeDelegate3 || delegate3Name.trim().length > 0
  const isFormValid = isDelegate1Valid && isDelegate2Valid && isDelegate3Valid

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Delegation</DialogTitle>
          <DialogDescription>
            Add up to 3 delegates to a new team. Team ID will be {nextTeamId}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Delegate 1 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Delegate 1 Name <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="Enter delegate name"
              value={delegate1Name}
              onChange={(e) => {
                setDelegate1Name(e.target.value)
                if (errors.delegate1) {
                  setErrors({ ...errors, delegate1: '' })
                }
              }}
              disabled={isSubmitting}
              className={errors.delegate1 ? 'border-destructive' : ''}
            />
            {errors.delegate1 && <p className="text-xs text-destructive">{errors.delegate1}</p>}
          </div>

          {/* Delegate 2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="include-delegate-2"
                checked={includeDelegate2}
                onCheckedChange={(checked) => setIncludeDelegate2(checked as boolean)}
                disabled={isSubmitting}
              />
              <label htmlFor="include-delegate-2" className="text-sm font-medium cursor-pointer">
                Include Delegate 2
              </label>
            </div>
            <Input
              placeholder="Enter delegate name"
              value={delegate2Name}
              onChange={(e) => {
                setDelegate2Name(e.target.value)
                if (errors.delegate2) {
                  setErrors({ ...errors, delegate2: '' })
                }
              }}
              disabled={!includeDelegate2 || isSubmitting}
              className={errors.delegate2 ? 'border-destructive' : ''}
            />
            {errors.delegate2 && <p className="text-xs text-destructive">{errors.delegate2}</p>}
          </div>

          {/* Delegate 3 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="include-delegate-3"
                checked={includeDelegate3}
                onCheckedChange={(checked) => setIncludeDelegate3(checked as boolean)}
                disabled={isSubmitting}
              />
              <label htmlFor="include-delegate-3" className="text-sm font-medium cursor-pointer">
                Include Delegate 3
              </label>
            </div>
            <Input
              placeholder="Enter delegate name"
              value={delegate3Name}
              onChange={(e) => {
                setDelegate3Name(e.target.value)
                if (errors.delegate3) {
                  setErrors({ ...errors, delegate3: '' })
                }
              }}
              disabled={!includeDelegate3 || isSubmitting}
              className={errors.delegate3 ? 'border-destructive' : ''}
            />
            {errors.delegate3 && <p className="text-xs text-destructive">{errors.delegate3}</p>}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Category <span className="text-muted-foreground">(applies to all)</span>
            </label>
            <Input
              placeholder="e.g., Engineering, Marketing"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty if no category applies
            </p>
          </div>

          {/* Team info */}
          <div className="rounded-lg bg-secondary/50 p-3">
            <p className="text-sm text-muted-foreground">
              Team number will be <span className="font-semibold text-foreground">{nextTeamId}</span>
            </p>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex gap-3 justify-end pt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isFormValid || isSubmitting}
            className="gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Adding...' : 'Confirm'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
