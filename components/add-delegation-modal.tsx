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

const DELEGATE_COUNT = 10

export function AddDelegationModal({ open, onOpenChange, nextTeamId }: AddDelegationModalProps) {
  // Initialize state for up to 10 delegates
  const [delegateData, setDelegateData] = useState(
    Array.from({ length: DELEGATE_COUNT }, (_, i) => ({
      name: '',
      category: '',
      isHead: i === 0, // Only delegate 1 is head
      include: i < 2, // Delegates 1 and 2 included by default
    }))
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Delegate 1 is always required
    if (!delegateData[0].name.trim()) {
      newErrors.delegate1_name = 'Delegate 1 name is required'
    }

    // Check all included delegates
    for (let i = 1; i < DELEGATE_COUNT; i++) {
      if (delegateData[i].include && !delegateData[i].name.trim()) {
        newErrors[`delegate${i + 1}_name`] = `Delegate ${i + 1} name is required when included`
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleReset = () => {
    setDelegateData(
      Array.from({ length: DELEGATE_COUNT }, (_, i) => ({
        name: '',
        category: '',
        isHead: i === 0,
        include: i < 2,
      }))
    )
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
      // Build payload dynamically for up to 10 delegates
      const payload: Record<string, any> = {
        delegate_1_name: delegateData[0].name,
        delegate_1_category: delegateData[0].category || null,
        delegate_1_is_head: true,
      }

      for (let i = 1; i < DELEGATE_COUNT; i++) {
        payload[`delegate_${i + 1}_name`] = delegateData[i].name
        payload[`delegate_${i + 1}_category`] = delegateData[i].category || null
        payload[`delegate_${i + 1}_is_head`] = false
        payload[`include_delegate_${i + 1}`] = delegateData[i].include
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

  const isFormValid =
    delegateData[0].name.trim().length > 0 &&
    delegateData.every((d, i) => !d.include || d.name.trim().length > 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Delegation</DialogTitle>
          <DialogDescription>
            Add up to 10 delegates to a new team (Team ID: {nextTeamId}). Each delegate can have their own category.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[500px] overflow-y-auto scrollbar-invisible space-y-4 pr-4">
          {/* Delegate 1 - Always Required */}
          <div className="space-y-2 rounded-lg border border-border bg-secondary/20 p-3">
            <h3 className="text-sm font-semibold text-foreground">Delegate 1 <span className="text-destructive">*</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Name</label>
                <Input
                  placeholder="Enter delegate name"
                  value={delegateData[0].name}
                  onChange={(e) => {
                    const newData = [...delegateData]
                    newData[0].name = e.target.value
                    setDelegateData(newData)
                    if (errors.delegate1_name) {
                      setErrors({ ...errors, delegate1_name: '' })
                    }
                  }}
                  disabled={isSubmitting}
                  className={errors.delegate1_name ? 'border-destructive' : ''}
                />
                {errors.delegate1_name && (
                  <p className="text-xs text-destructive">{errors.delegate1_name}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Category</label>
                <Input
                  placeholder="e.g., Engineering"
                  value={delegateData[0].category}
                  onChange={(e) => {
                    const newData = [...delegateData]
                    newData[0].category = e.target.value
                    setDelegateData(newData)
                  }}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Checkbox
                id="delegate-1-head"
                checked={true}
                disabled={true}
              />
              <label htmlFor="delegate-1-head" className="text-sm font-medium cursor-default text-foreground">
                Delegate 1 is Head (auto-assigned)
              </label>
            </div>
          </div>

          {/* Delegates 2-10 */}
          {Array.from({ length: DELEGATE_COUNT - 1 }, (_, i) => {
            const delegateIndex = i + 1
            const delegateNumber = delegateIndex + 1
            const delegate = delegateData[delegateIndex]
            const errorKey = `delegate${delegateNumber}_name`

            return (
              <div key={delegateIndex} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`include-delegate-${delegateNumber}`}
                    checked={delegate.include}
                    onCheckedChange={(checked) => {
                      const newData = [...delegateData]
                      newData[delegateIndex].include = checked as boolean
                      setDelegateData(newData)
                    }}
                    disabled={isSubmitting}
                  />
                  <label htmlFor={`include-delegate-${delegateNumber}`} className="text-sm font-medium cursor-pointer">
                    Include Delegate {delegateNumber}
                  </label>
                </div>
                {delegate.include && (
                  <div className="rounded-lg border border-border bg-secondary/20 p-3 space-y-3 ml-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Name</label>
                        <Input
                          placeholder="Enter delegate name"
                          value={delegate.name}
                          onChange={(e) => {
                            const newData = [...delegateData]
                            newData[delegateIndex].name = e.target.value
                            setDelegateData(newData)
                            if (errors[errorKey]) {
                              setErrors({ ...errors, [errorKey]: '' })
                            }
                          }}
                          disabled={isSubmitting}
                          className={errors[errorKey] ? 'border-destructive' : ''}
                        />
                        {errors[errorKey] && (
                          <p className="text-xs text-destructive">{errors[errorKey]}</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Category</label>
                        <Input
                          placeholder="e.g., Engineering"
                          value={delegate.category}
                          onChange={(e) => {
                            const newData = [...delegateData]
                            newData[delegateIndex].category = e.target.value
                            setDelegateData(newData)
                          }}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
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
