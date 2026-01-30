import type { DelegateClient } from "./types"

export interface TeamRow {
  teamId: number
  delegateCount: number
  delegates: Array<{
    name: string
    category: string | null
    day1: boolean
    day2: boolean
    day3: boolean
  }>
}

export function groupDelegatesByTeam(delegates: DelegateClient[]): TeamRow[] {
  const grouped = new Map<number, DelegateClient[]>()

  // Group delegates by team_id
  delegates.forEach((delegate) => {
    const teamId = delegate.team_id
    if (!grouped.has(teamId)) {
      grouped.set(teamId, [])
    }
    grouped.get(teamId)!.push(delegate)
  })

  // Convert to TeamRow array with sorted delegates
  const teamRows: TeamRow[] = []
  const sortedTeamIds = Array.from(grouped.keys()).sort((a, b) => a - b)

  sortedTeamIds.forEach((teamId) => {
    const teamDelegates = grouped.get(teamId)!
    // Sort by delegate name ascending
    teamDelegates.sort((a, b) => a.delegate_name.localeCompare(b.delegate_name))

    const row: TeamRow = {
      teamId,
      delegateCount: teamDelegates.length,
      delegates: teamDelegates.map((d) => ({
        name: d.delegate_name,
        category: d.category,
        day1: d.attendance.day1,
        day2: d.attendance.day2,
        day3: d.attendance.day3,
      })),
    }

    teamRows.push(row)
  })

  return teamRows
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
