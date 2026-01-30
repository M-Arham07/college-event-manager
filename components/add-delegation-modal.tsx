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
  const [delegate1Category, setDelegate1Category] = useState('')
  const [delegate2Name, setDelegate2Name] = useState('')
  const [delegate2Category, setDelegate2Category] = useState('')
  const [delegate3Name, setDelegate3Name] = useState('')
  const [delegate3Category, setDelegate3Category] = useState('')
  const [delegate4Name, setDelegate4Name] = useState('')
  const [delegate4Category, setDelegate4Category] = useState('')
  const [delegate5Name, setDelegate5Name] = useState('')
  const [delegate5Category, setDelegate5Category] = useState('')
  const [delegate1IsHead, setDelegate1IsHead] = useState(true)
  const [delegate2IsHead, setDelegate2IsHead] = useState(false)
  const [delegate3IsHead, setDelegate3IsHead] = useState(false)
  const [delegate4IsHead, setDelegate4IsHead] = useState(false)
  const [delegate5IsHead, setDelegate5IsHead] = useState(false)
  const [includeDelegate2, setIncludeDelegate2] = useState(true)
  const [includeDelegate3, setIncludeDelegate3] = useState(true)
  const [includeDelegate4, setIncludeDelegate4] = useState(false)
  const [includeDelegate5, setIncludeDelegate5] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [category, setCategory] = useState('')

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!delegate1Name.trim()) {
      newErrors.delegate1_name = 'Delegate 1 name is required'
    }

    if (includeDelegate2 && !delegate2Name.trim()) {
      newErrors.delegate2_name = 'Delegate 2 name is required when included'
    }

    if (includeDelegate3 && !delegate3Name.trim()) {
      newErrors.delegate3_name = 'Delegate 3 name is required when included'
    }

    if (includeDelegate4 && !delegate4Name.trim()) {
      newErrors.delegate4_name = 'Delegate 4 name is required when included'
    }

    if (includeDelegate5 && !delegate5Name.trim()) {
      newErrors.delegate5_name = 'Delegate 5 name is required when included'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleReset = () => {
    setDelegate1Name('')
    setDelegate1Category('')
    setDelegate1IsHead(false)
    setDelegate2Name('')
    setDelegate2Category('')
    setDelegate2IsHead(false)
    setDelegate3Name('')
    setDelegate3Category('')
    setDelegate3IsHead(false)
    setDelegate4Name('')
    setDelegate4Category('')
    setDelegate4IsHead(false)
    setDelegate5Name('')
    setDelegate5Category('')
    setDelegate5IsHead(false)
    setIncludeDelegate2(true)
    setIncludeDelegate3(true)
    setIncludeDelegate4(false)
    setIncludeDelegate5(false)
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
        delegate_1_category: delegate1Category || null,
        delegate_1_is_head: true,
        delegate_2_name: delegate2Name,
        delegate_2_category: delegate2Category || null,
        delegate_2_is_head: delegate2IsHead,
        delegate_3_name: delegate3Name,
        delegate_3_category: delegate3Category || null,
        delegate_3_is_head: delegate3IsHead,
        delegate_4_name: delegate4Name,
        delegate_4_category: delegate4Category || null,
        delegate_4_is_head: delegate4IsHead,
        delegate_5_name: delegate5Name,
        delegate_5_category: delegate5Category || null,
        delegate_5_is_head: delegate5IsHead,
        include_delegate_2: includeDelegate2,
        include_delegate_3: includeDelegate3,
        include_delegate_4: includeDelegate4,
        include_delegate_5: includeDelegate5,
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
  const isDelegate4Valid = !includeDelegate4 || delegate4Name.trim().length > 0
  const isDelegate5Valid = !includeDelegate5 || delegate5Name.trim().length > 0
  const isFormValid =
    isDelegate1Valid && isDelegate2Valid && isDelegate3Valid && isDelegate4Valid && isDelegate5Valid

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Delegation</DialogTitle>
          <DialogDescription>
            Add up to 5 delegates to a new team (Team ID: {nextTeamId}). Each delegate can have their own category.
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
                  value={delegate1Name}
                  onChange={(e) => {
                    setDelegate1Name(e.target.value)
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
                  value={delegate1Category}
                  onChange={(e) => setDelegate1Category(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Checkbox
                id="delegate-1-head"
                checked={true}
                onCheckedChange={(checked) => setDelegate1IsHead(checked as boolean)}
                disabled={isSubmitting}
              />
              <label htmlFor="delegate-1-head" className="text-sm font-medium cursor-pointer text-foreground">
                Delegate 1 will be head
              </label>
            </div>
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
            {includeDelegate2 && (
              <div className="rounded-lg border border-border bg-secondary/20 p-3 space-y-3 ml-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Name</label>
                    <Input
                      placeholder="Enter delegate name"
                      value={delegate2Name}
                      onChange={(e) => {
                        setDelegate2Name(e.target.value)
                        if (errors.delegate2_name) {
                          setErrors({ ...errors, delegate2_name: '' })
                        }
                      }}
                      disabled={isSubmitting}
                      className={errors.delegate2_name ? 'border-destructive' : ''}
                    />
                    {errors.delegate2_name && (
                      <p className="text-xs text-destructive">{errors.delegate2_name}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Category</label>
                    <Input
                      placeholder="e.g., Engineering"
                      value={delegate2Category}
                      onChange={(e) => setDelegate2Category(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  {/* <Checkbox
                    id="delegate-2-head"
                    checked={delegate2IsHead}
                    onCheckedChange={(checked) => setDelegate2IsHead(checked as boolean)}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="delegate-2-head" className="text-sm font-medium cursor-pointer text-foreground">
                    Mark as Head
                  </label> */}
                </div>
              </div>
            )}
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
            {includeDelegate3 && (
              <div className="rounded-lg border border-border bg-secondary/20 p-3 space-y-3 ml-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Name</label>
                    <Input
                      placeholder="Enter delegate name"
                      value={delegate3Name}
                      onChange={(e) => {
                        setDelegate3Name(e.target.value)
                        if (errors.delegate3_name) {
                          setErrors({ ...errors, delegate3_name: '' })
                        }
                      }}
                      disabled={isSubmitting}
                      className={errors.delegate3_name ? 'border-destructive' : ''}
                    />
                    {errors.delegate3_name && (
                      <p className="text-xs text-destructive">{errors.delegate3_name}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Category</label>
                    <Input
                      placeholder="e.g., Engineering"
                      value={delegate3Category}
                      onChange={(e) => setDelegate3Category(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  {/* <Checkbox
                    id="delegate-3-head"
                    checked={delegate3IsHead}
                    onCheckedChange={(checked) => setDelegate3IsHead(checked as boolean)}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="delegate-3-head" className="text-sm font-medium cursor-pointer text-foreground">
                    Mark as Head
                  </label> */}
                </div>
              </div>
            )}
          </div>

          {/* Delegate 4 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="include-delegate-4"
                checked={includeDelegate4}
                onCheckedChange={(checked) => setIncludeDelegate4(checked as boolean)}
                disabled={isSubmitting}
              />
              <label htmlFor="include-delegate-4" className="text-sm font-medium cursor-pointer">
                Include Delegate 4
              </label>
            </div>
            {includeDelegate4 && (
              <div className="rounded-lg border border-border bg-secondary/20 p-3 space-y-3 ml-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Name</label>
                    <Input
                      placeholder="Enter delegate name"
                      value={delegate4Name}
                      onChange={(e) => {
                        setDelegate4Name(e.target.value)
                        if (errors.delegate4_name) {
                          setErrors({ ...errors, delegate4_name: '' })
                        }
                      }}
                      disabled={isSubmitting}
                      className={errors.delegate4_name ? 'border-destructive' : ''}
                    />
                    {errors.delegate4_name && (
                      <p className="text-xs text-destructive">{errors.delegate4_name}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Category</label>
                    <Input
                      placeholder="e.g., Engineering"
                      value={delegate4Category}
                      onChange={(e) => setDelegate4Category(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  {/* <Checkbox
                    id="delegate-4-head"
                    checked={delegate4IsHead}
                    onCheckedChange={(checked) => setDelegate4IsHead(checked as boolean)}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="delegate-4-head" className="text-sm font-medium cursor-pointer text-foreground">
                    Mark as Head
                  </label> */}
                </div>
              </div>
            )}
          </div>

          {/* Delegate 5 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="include-delegate-5"
                checked={includeDelegate5}
                onCheckedChange={(checked) => setIncludeDelegate5(checked as boolean)}
                disabled={isSubmitting}
              />
              <label htmlFor="include-delegate-5" className="text-sm font-medium cursor-pointer">
                Include Delegate 5
              </label>
            </div>
            {includeDelegate5 && (
              <div className="rounded-lg border border-border bg-secondary/20 p-3 space-y-3 ml-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Name</label>
                    <Input
                      placeholder="Enter delegate name"
                      value={delegate5Name}
                      onChange={(e) => {
                        setDelegate5Name(e.target.value)
                        if (errors.delegate5_name) {
                          setErrors({ ...errors, delegate5_name: '' })
                        }
                      }}
                      disabled={isSubmitting}
                      className={errors.delegate5_name ? 'border-destructive' : ''}
                    />
                    {errors.delegate5_name && (
                      <p className="text-xs text-destructive">{errors.delegate5_name}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Category</label>
                    <Input
                      placeholder="e.g., Engineering"
                      value={delegate5Category}
                      onChange={(e) => setDelegate5Category(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  {/* <Checkbox
                    id="delegate-5-head"
                    checked={delegate5IsHead}
                    onCheckedChange={(checked) => setDelegate5IsHead(checked as boolean)}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="delegate-5-head" className="text-sm font-medium cursor-pointer text-foreground">
                    Mark as Head
                  </label> */}
                </div>
              </div>
            )}
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
