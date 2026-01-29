'use client'

import { useCallback, useMemo, useState } from 'react'
import { Search, X, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { DelegateClient } from '@/lib/types'

interface AdvancedFiltersProps {
  delegates: DelegateClient[]
  teams: number[]
  categories: string[]
  onFilteredDelegatesChange: (delegates: DelegateClient[]) => void
}

export interface FilterState {
  searchText: string
  selectedTeams: Set<number>
  selectedCategories: Set<string>
  attendanceFilter: 'all' | 'present' | 'absent'
  sortBy: 'name' | 'team' | 'attendance'
  sortOrder: 'asc' | 'desc'
}

export function AdvancedFilters({
  delegates,
  teams,
  categories,
  onFilteredDelegatesChange,
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchText: '',
    selectedTeams: new Set(),
    selectedCategories: new Set(),
    attendanceFilter: 'all',
    sortBy: 'team',
    sortOrder: 'asc',
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  // Apply all filters and sorting
  const filteredDelegates = useMemo(() => {
    let result = [...delegates]

    // Text search filter
    if (filters.searchText.trim()) {
      const searchLower = filters.searchText.toLowerCase()
      result = result.filter((delegate) => {
        const nameMatch = delegate.delegate_name.toLowerCase().includes(searchLower)
        const categoryMatch = delegate.category?.toLowerCase().includes(searchLower) ?? false
        const teamMatch = delegate.team_id.toString().includes(searchLower)
        return nameMatch || categoryMatch || teamMatch
      })
    }

    // Team filter
    if (filters.selectedTeams.size > 0) {
      result = result.filter((delegate) => filters.selectedTeams.has(delegate.team_id))
    }

    // Category filter
    if (filters.selectedCategories.size > 0) {
      result = result.filter((delegate) => delegate.category && filters.selectedCategories.has(delegate.category))
    }

    // Attendance filter
    if (filters.attendanceFilter === 'present') {
      result = result.filter((delegate) => delegate.attendance === true)
    } else if (filters.attendanceFilter === 'absent') {
      result = result.filter((delegate) => delegate.attendance === false)
    }

    // Sorting
    result.sort((a, b) => {
      let compareValue = 0

      if (filters.sortBy === 'name') {
        compareValue = a.delegate_name.localeCompare(b.delegate_name)
      } else if (filters.sortBy === 'team') {
        compareValue = a.team_id - b.team_id || a.delegate_name.localeCompare(b.delegate_name)
      } else if (filters.sortBy === 'attendance') {
        compareValue = (a.attendance ? 1 : 0) - (b.attendance ? 1 : 0)
      }

      return filters.sortOrder === 'asc' ? compareValue : -compareValue
    })

    return result
  }, [delegates, filters])

  // Notify parent of filtered results
  useMemo(() => {
    onFilteredDelegatesChange(filteredDelegates)
  }, [filteredDelegates, onFilteredDelegatesChange])

  const toggleTeam = useCallback((team: number) => {
    setFilters((prev) => {
      const newTeams = new Set(prev.selectedTeams)
      if (newTeams.has(team)) {
        newTeams.delete(team)
      } else {
        newTeams.add(team)
      }
      return { ...prev, selectedTeams: newTeams }
    })
  }, [])

  const toggleCategory = useCallback((category: string) => {
    setFilters((prev) => {
      const newCategories = new Set(prev.selectedCategories)
      if (newCategories.has(category)) {
        newCategories.delete(category)
      } else {
        newCategories.add(category)
      }
      return { ...prev, selectedCategories: newCategories }
    })
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({
      searchText: '',
      selectedTeams: new Set(),
      selectedCategories: new Set(),
      attendanceFilter: 'all',
      sortBy: 'team',
      sortOrder: 'asc',
    })
  }, [])

  const hasActiveFilters =
    filters.searchText ||
    filters.selectedTeams.size > 0 ||
    filters.selectedCategories.size > 0 ||
    filters.attendanceFilter !== 'all'

  return (
    <div className="space-y-4">
      {/* Main filter row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, team, category..."
            value={filters.searchText}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchText: e.target.value }))}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={filters.attendanceFilter} onValueChange={(value) => {
            setFilters((prev) => ({ ...prev, attendanceFilter: value as FilterState['attendanceFilter'] }))
          }}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Attendance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="h-9"
          >
            More Filters
            <ChevronDown className={`ml-1 size-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 px-2 text-muted-foreground hover:text-foreground"
            >
              <X className="mr-1 size-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="space-y-4 rounded-lg border border-border bg-card p-4">
          {/* Teams filter */}
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Teams</p>
            <div className="flex flex-wrap gap-2">
              {teams.map((team) => (
                <Badge
                  key={team}
                  variant={filters.selectedTeams.has(team) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleTeam(team)}
                >
                  Team {team}
                  {filters.selectedTeams.has(team) && <X className="ml-1 size-3" />}
                </Badge>
              ))}
            </div>
          </div>

          {/* Categories filter */}
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Categories</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={filters.selectedCategories.has(category) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                  {filters.selectedCategories.has(category) && <X className="ml-1 size-3" />}
                </Badge>
              ))}
            </div>
          </div>

          {/* Sorting */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Sort By</label>
              <Select value={filters.sortBy} onValueChange={(value) => {
                setFilters((prev) => ({ ...prev, sortBy: value as FilterState['sortBy'] }))
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="attendance">Attendance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Order</label>
              <Select value={filters.sortOrder} onValueChange={(value) => {
                setFilters((prev) => ({ ...prev, sortOrder: value as FilterState['sortOrder'] }))
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active filters summary */}
          {hasActiveFilters && (
            <div className="space-y-2 border-t border-border pt-4">
              <p className="text-sm font-medium text-foreground">Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {filters.searchText && (
                  <Badge variant="secondary">
                    Search: {filters.searchText}
                    <X className="ml-1 size-3 cursor-pointer" onClick={() => setFilters((prev) => ({ ...prev, searchText: '' }))} />
                  </Badge>
                )}
                {filters.attendanceFilter !== 'all' && (
                  <Badge variant="secondary">
                    {filters.attendanceFilter === 'present' ? 'Present' : 'Absent'}
                    <X className="ml-1 size-3 cursor-pointer" onClick={() => setFilters((prev) => ({ ...prev, attendanceFilter: 'all' }))} />
                  </Badge>
                )}
                {Array.from(filters.selectedTeams).map((team) => (
                  <Badge key={`team-${team}`} variant="secondary">
                    Team {team}
                    <X className="ml-1 size-3 cursor-pointer" onClick={() => toggleTeam(team)} />
                  </Badge>
                ))}
                {Array.from(filters.selectedCategories).map((category) => (
                  <Badge key={`cat-${category}`} variant="secondary">
                    {category}
                    <X className="ml-1 size-3 cursor-pointer" onClick={() => toggleCategory(category)} />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Results count */}
          <div className="border-t border-border pt-4 text-sm text-muted-foreground">
            Showing {filteredDelegates.length} of {delegates.length} delegates
          </div>
        </div>
      )}

      {/* Compact filter summary when advanced is closed */}
      {!showAdvanced && hasActiveFilters && (
        <div className="flex flex-wrap gap-1">
          {filters.searchText && (
            <Badge variant="secondary" className="text-xs">
              Search: {filters.searchText.length > 15 ? filters.searchText.slice(0, 15) + '...' : filters.searchText}
            </Badge>
          )}
          {filters.selectedTeams.size > 0 && (
            <Badge variant="secondary" className="text-xs">
              {filters.selectedTeams.size} team(s)
            </Badge>
          )}
          {filters.selectedCategories.size > 0 && (
            <Badge variant="secondary" className="text-xs">
              {filters.selectedCategories.size} categor(ies)
            </Badge>
          )}
          {filters.attendanceFilter !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              {filters.attendanceFilter === 'present' ? 'Present Only' : 'Absent Only'}
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
