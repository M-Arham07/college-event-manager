import { Suspense } from "react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import connectDB from "@/lib/mongodb"
import Delegate from "@/lib/models/delegate"
import { UserHeader } from "@/components/user-header"
import { DashboardContent } from "@/components/dashboard-content"
import { Toaster } from "@/components/ui/sonner"
import { Skeleton } from "@/components/ui/skeleton"
import type { DelegateClient, DelegateStats } from "@/lib/types"

async function getDelegatesData() {
  await connectDB()

  // Fetch all delegates from database
  const allDelegates = await Delegate.find({}).sort({ team_id: 1, delegate_name: 1 }).lean()

  // Calculate stats from all delegates
  const stats: DelegateStats = {
    total: allDelegates.length,
    present: allDelegates.filter((d) => d.attendance.day1 && d.attendance.day2 && d.attendance.day3).length,
    absent: allDelegates.filter((d) => !(d.attendance.day1 && d.attendance.day2 && d.attendance.day3)).length,
    uniqueTeams: new Set(allDelegates.map((d) => d.team_id)).size,
  }

  // Get unique teams and categories for filter options
  const teams = [...new Set(allDelegates.map((d) => d.team_id))].sort((a, b) => a - b)
  const categories = [
    ...new Set(allDelegates.map((d) => d.category).filter((c): c is string => c !== null)),
  ].sort()

  // Convert to client-safe format
  const clientDelegates: DelegateClient[] = allDelegates.map((d) => ({
    _id: d._id.toString(),
    team_id: d.team_id,
    delegate_name: d.delegate_name,
    category: d.category,
    attendance: d.attendance,
    createdAt: new Date(d.createdAt).toISOString(),
    updatedAt: new Date(d.updatedAt).toISOString(),
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
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-[400px] rounded-lg" />
        </div>
      </div>
    </div>
  )
}

async function DashboardContentServer() {
  const { delegates, stats, teams, categories, totalCount } = await getDelegatesData()

  return (
    <DashboardContent 
      initialDelegates={delegates}
      stats={stats}
      teams={teams}
      categories={categories}
      totalCount={totalCount}
    />
  )
}

export default async function Page() {
  const session = await getServerSession()
  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 space-y-6">
          <UserHeader />
          <header>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Misaal Attendance
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track and manage delegate attendance with powerful real-time filtering
            </p>
          </header>
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          <DashboardContentServer />
        </Suspense>

        <footer className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          Data stored in MongoDB with instant state-based filtering
        </footer>
      </div>
      <Toaster position="bottom-right" />
    </main>
  )
}
