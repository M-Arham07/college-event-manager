import { Suspense } from "react"
import connectDB from "@/lib/mongodb"
import Delegate from "@/lib/models/delegate"
import { StatsCards } from "@/components/stats-cards"
import { DelegatesFilters } from "@/components/delegates-filters"
import { DelegatesTable } from "@/components/delegates-table"
import { CopyJsonButton } from "@/components/copy-json-button"
import { Toaster } from "@/components/ui/sonner"
import type { DelegateClient, FilterParams, DelegateStats } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

interface PageProps {
  searchParams: Promise<FilterParams>
}

async function getDelegatesData(filters: FilterParams) {
  await connectDB()

  // Build query based on filters
  const query: Record<string, unknown> = {}

  // Search filter (case-insensitive partial match on name/category)
  if (filters.search) {
    const searchRegex = new RegExp(filters.search, "i")
    query.$or = [{ delegate_name: searchRegex }, { category: searchRegex }]
  }

  // Team filter
  if (filters.team && filters.team !== "all") {
    query.team_id = parseInt(filters.team, 10)
  }

  // Category filter
  if (filters.category && filters.category !== "all") {
    query.category = filters.category
  }

  // Attendance filter
  if (filters.attendance === "present") {
    query.attendance = true
  } else if (filters.attendance === "absent") {
    query.attendance = false
  }

  // Fetch filtered delegates
  const delegates = await Delegate.find(query).sort({ team_id: 1, delegate_name: 1 }).lean()

  // Get all delegates for stats and filter options
  const allDelegates = await Delegate.find({}).lean()

  // Calculate stats from all delegates
  const stats: DelegateStats = {
    total: allDelegates.length,
    present: allDelegates.filter((d) => d.attendance).length,
    absent: allDelegates.filter((d) => !d.attendance).length,
    uniqueTeams: new Set(allDelegates.map((d) => d.team_id)).size,
  }

  // Get unique teams and categories for filters
  const teams = [...new Set(allDelegates.map((d) => d.team_id))].sort((a, b) => a - b)
  const categories = [
    ...new Set(allDelegates.map((d) => d.category).filter((c): c is string => c !== null)),
  ].sort()

  // Convert to client-safe format
  const clientDelegates: DelegateClient[] = delegates.map((d) => ({
    _id: d._id.toString(),
    team_id: d.team_id,
    delegate_name: d.delegate_name,
    category: d.category,
    attendance: d.attendance,
    createdAt: new Date(d.createdAt).toISOString() || "",
    updatedAt: new Date(d.updatedAt).toISOString() || "",
  }))

  return {
    delegates: clientDelegates,
    stats,
    teams,
    categories,
    totalCount: allDelegates.length,
  }
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[76px] rounded-lg" />
        ))}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-9 w-full sm:max-w-xs" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-[130px]" />
          <Skeleton className="h-9 w-[140px]" />
          <Skeleton className="h-9 w-[130px]" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-[400px] rounded-lg" />
      </div>
    </div>
  )
}

async function DashboardContent({ searchParams }: PageProps) {
  const filters = await searchParams
  const { delegates, stats, teams, categories, totalCount } = await getDelegatesData(filters)

  return (
    <div className="space-y-6">
      <StatsCards stats={stats} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DelegatesFilters teams={teams} categories={categories} />
        <CopyJsonButton delegates={delegates} />
      </div>

      <DelegatesTable delegates={delegates} totalCount={totalCount} />
    </div>
  )
}

export default async function Page({ searchParams }: PageProps) {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Misaal Attendance
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track and manage delegate attendance
          </p>
        </header>

        <Suspense fallback={<LoadingSkeleton />}>
          <DashboardContent searchParams={searchParams} />
        </Suspense>

        <footer className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          Data stored in MongoDB
        </footer>
      </div>
      <Toaster position="bottom-right" />
    </main>
  )
}
