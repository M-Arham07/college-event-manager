'use client'

import { useCallback, useState } from 'react'
import { StatsCards } from '@/components/stats-cards'
import { AdvancedFilters } from '@/components/advanced-filters'
import { DelegatesTable } from '@/components/delegates-table'
import { CopyJsonButton } from '@/components/copy-json-button'
import type { DelegateClient, DelegateStats } from '@/lib/types'

interface DashboardContentProps {
  initialDelegates: DelegateClient[]
  stats: DelegateStats
  teams: number[]
  categories: string[]
  totalCount: number
}

export function DashboardContent({
  initialDelegates,
  stats,
  teams,
  categories,
  totalCount,
}: DashboardContentProps) {
  const [filteredDelegates, setFilteredDelegates] = useState<DelegateClient[]>(initialDelegates)

  const handleFilteredDelegatesChange = useCallback((delegates: DelegateClient[]) => {
    setFilteredDelegates(delegates)
  }, [])

  return (
    <div className="space-y-6">
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
        <CopyJsonButton delegates={filteredDelegates} />
      </div>

      <DelegatesTable delegates={filteredDelegates} totalCount={totalCount} />
    </div>
  )
}
