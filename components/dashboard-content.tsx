'use client'

import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { StatsCards } from '@/components/stats-cards'
import { AdvancedFilters } from '@/components/advanced-filters'
import { DelegatesTable } from '@/components/delegates-table'
import { DownloadAttendanceButton } from '@/components/download-attendance-button'
import { AddDelegationModal } from '@/components/add-delegation-modal'
import { AccessBadge } from '@/components/access-badge'
import { CopyJsonButton } from '@/components/copy-json-button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { DelegateClient, DelegateStats } from '@/lib/types'

interface DashboardContentProps {
  initialDelegates: DelegateClient[]
  stats: DelegateStats
  teams: number[]
  categories: string[]
  totalCount: number
  accessMode: 'view' | 'edit'
  userEmail?: string | null
}

export function DashboardContent({
  initialDelegates,
  stats,
  teams,
  categories,
  totalCount,
  accessMode,
  userEmail,
}: DashboardContentProps) {
  const [filteredDelegates, setFilteredDelegates] = useState<DelegateClient[]>(initialDelegates)
  const [addDelegationOpen, setAddDelegationOpen] = useState(false)
  const isEditMode = accessMode === 'edit'

  // Calculate next team ID
  const maxTeamId = teams.length > 0 ? Math.max(...teams) : 0
  const nextTeamId = maxTeamId + 1

  const handleFilteredDelegatesChange = useCallback((delegates: DelegateClient[]) => {
    setFilteredDelegates(delegates)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
        <AccessBadge mode={accessMode} email={userEmail} />
      </div>

      <StatsCards stats={stats} />

      <AdvancedFilters
        delegates={initialDelegates}
        teams={teams}
        categories={categories}
        onFilteredDelegatesChange={handleFilteredDelegatesChange}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredDelegates.length}</span> of{' '}
          <span className="font-semibold text-foreground">{totalCount}</span> delegates
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    onClick={() => setAddDelegationOpen(true)}
                    disabled={!isEditMode}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Delegation
                  </Button>
                </span>
              </TooltipTrigger>
              {!isEditMode && (
                <TooltipContent>Only editors can add delegations</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <DownloadAttendanceButton />
        </div>
      </div>

      <DelegatesTable delegates={filteredDelegates} totalCount={totalCount} isEditMode={isEditMode} />

      <AddDelegationModal
        open={addDelegationOpen}
        onOpenChange={setAddDelegationOpen}
        nextTeamId={nextTeamId}
      />
    </div>
  )
}
