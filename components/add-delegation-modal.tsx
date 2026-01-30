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

type DelegateNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export function AddDelegationModal({ open, onOpenChange, nextTeamId }: AddDelegationModalProps) {
  // Delegate names and categories (1-10)
  const [delegateData, setDelegateData] = useState<Record<DelegateNumber, { name: string; category: string }>>({
    1: { name: '', category: '' },
    2: { name: '', category: '' },
    3: { name: '', category: '' },
    4: { name: '', category: '' },
    5: { name: '', category: '' },
    6: { name: '', category: '' },
    7: { name: '', category: '' },
    8: { name: '', category: '' },
    9: { name: '', category: '' },
    10: { name: '', category: '' },
  })

  // Include flags for delegates 2-10
  const [includeDelegates, setIncludeDelegates] = useState<Record<DelegateNumber, boolean>>({
    1: true,
    2: true,
    3: true,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
    10: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Delegate 1 is required
    if (!delegateData[1].name.trim()) {
      newErrors.delegate1_name = 'Delegate 1 name is required'
    }

    // Validate delegates 2-10
    for (let i = 2; i <= 10; i++) {
      const num = i as DelegateNumber
      if (includeDelegates[num] && !delegateData[num].name.trim()) {
        newErrors[`delegate${num}_name`] = `Delegate ${num} name is required when included`
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleReset = () => {
    setDelegateData({
      1: { name: '', category: '' },
      2: { name: '', category: '' },
      3: { name: '', category: '' },
      4: { name: '', category: '' },
      5: { name: '', category: '' },
      6: { name: '', category: '' },
      7: { name: '', category: '' },
      8: { name: '', category: '' },
      9: { name: '', category: '' },
      10: { name: '', category: '' },
    })
    setIncludeDelegates({
      1: true,
      2: true,
      3: true,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
      10: false,
    })
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
      const payload: any = {
        delegate_1_name: delegateData[1].name,
        delegate_1_category: delegateData[1].category || null,
        delegate_1_is_head: true,
      }

      // Add delegates 2-10
      for (let i = 2; i <= 10; i++) {
        const num = i as DelegateNumber
        payload[`delegate_${i}_name`] = delegateData[num].name
        payload[`delegate_${i}_category`] = delegateData[num].category || null
        payload[`delegate_${i}_is_head`] = false
        payload[`include_delegate_${i}`] = includeDelegates[num]
      }

      const result = await addDelegation(payload)

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

  // Check if form is valid (for UI purposes)
  const isFormValid = (): boolean => {
    if (!delegateData[1].name.trim()) return false

    for (let i = 2; i <= 10; i++) {
      const num = i as DelegateNumber
      if (includeDelegates[num] && !delegateData[num].name.trim()) {
        return false
      }
    }
    return true
  }

  const renderDelegateInput = (delegateNum: DelegateNumber) => {
    const isRequired = delegateNum === 1
    const isIncluded = includeDelegates[delegateNum]
    const data = delegateData[delegateNum]
    const errorKey = `delegate${delegateNum}_name`
    const hasError = !!errors[errorKey]

    if (isRequired) {
      return (
        <div key={delegateNum} className="space-y-2 rounded-lg border border-border bg-secondary/20 p-3">
          <h3 className="text-sm font-semibold text-foreground">
            Delegate {delegateNum} <span className="text-destructive">*</span> (Head)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Name</label>
              <Input
                placeholder="Enter delegate name"
                value={data.name}
                onChange={(e) => {
                  setDelegateData({ ...delegateData, [delegateNum]: { ...data, name: e.target.value } })
                  if (hasError) {
                    setErrors({ ...errors, [errorKey]: '' })
                  }
                }}
                disabled={isSubmitting}
                className={hasError ? 'border-destructive' : ''}
              />
              {hasError && <p className="text-xs text-destructive">{errors[errorKey]}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Category</label>
              <Input
                placeholder="e.g., Engineering"
                value={data.category}
                onChange={(e) => setDelegateData({ ...delegateData, [delegateNum]: { ...data, category: e.target.value } })}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>
      )
    }

    return (
      <div key={delegateNum} className="space-y-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id={`include-delegate-${delegateNum}`}
            checked={isIncluded}
            onCheckedChange={(checked) => setIncludeDelegates({ ...includeDelegates, [delegateNum]: checked as boolean })}
            disabled={isSubmitting}
          />
          <label htmlFor={`include-delegate-${delegateNum}`} className="text-sm font-medium cursor-pointer">
            Include Delegate {delegateNum}
          </label>
        </div>
        {isIncluded && (
          <div className="rounded-lg border border-border bg-secondary/20 p-3 space-y-3 ml-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Name</label>
                <Input
                  placeholder="Enter delegate name"
                  value={data.name}
                  onChange={(e) => {
                    setDelegateData({ ...delegateData, [delegateNum]: { ...data, name: e.target.value } })
                    if (hasError) {
                      setErrors({ ...errors, [errorKey]: '' })
                    }
                  }}
                  disabled={isSubmitting}
                  className={hasError ? 'border-destructive' : ''}
                />
                {hasError && <p className="text-xs text-destructive">{errors[errorKey]}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Category</label>
                <Input
                  placeholder="e.g., Engineering"
                  value={data.category}
                  onChange={(e) => setDelegateData({ ...delegateData, [delegateNum]: { ...data, category: e.target.value } })}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              {/* <Checkbox
                id={`delegate-${delegateNum}-head`}
                checked={false}
                onCheckedChange={(checked) => setDelegateData({ ...delegateData, [delegateNum]: { ...data, is_head: checked as boolean } })}
                disabled={isSubmitting}
              />
              <label htmlFor={`delegate-${delegateNum}-head`} className="text-sm font-medium cursor-pointer text-foreground">
                Mark as Head
              </label> */}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Delegation</DialogTitle>
          <DialogDescription>
            Add up to 10 delegates to a new team (Team ID: {nextTeamId}). Delegate 1 is the head, others are optional.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[500px] overflow-y-auto scrollbar-invisible space-y-4 pr-4">
          {/* Render all 10 delegates */}
          {Array.from({ length: 10 }).map((_, i) => renderDelegateInput((i + 1) as DelegateNumber))}
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
            disabled={!isFormValid() || isSubmitting}
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
