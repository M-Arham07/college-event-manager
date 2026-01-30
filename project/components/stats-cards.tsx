import { Users, UserCheck, UserX, Building2 } from "lucide-react"
import type { DelegateStats } from "@/lib/types"

interface StatsCardsProps {
  stats: DelegateStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: "Total Delegates",
      value: stats.total,
      icon: Users,
    },
    {
      label: "Present",
      value: stats.present,
      icon: UserCheck,
      highlight: "success" as const,
    },
    {
      label: "Absent",
      value: stats.absent,
      icon: UserX,
      highlight: "warning" as const,
    },
    {
      label: "Unique Teams",
      value: stats.uniqueTeams,
      icon: Building2,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex items-center gap-3 rounded-lg border border-border bg-card p-4"
        >
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
              card.highlight === "success"
                ? "bg-success/20 text-success"
                : card.highlight === "warning"
                  ? "bg-warning/20 text-warning"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            <card.icon className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-semibold text-foreground">{card.value}</p>
            <p className="truncate text-xs text-muted-foreground">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
