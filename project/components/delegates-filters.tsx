"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useTransition } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DelegatesFiltersProps {
  teams: number[]
  categories: string[]
}

export function DelegatesFilters({ teams, categories }: DelegatesFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const search = searchParams.get("search") || ""
  const team = searchParams.get("team") || "all"
  const category = searchParams.get("category") || "all"
  const attendance = searchParams.get("attendance") || "all"

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === "all" || value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
      startTransition(() => {
        router.push(`/?${params.toString()}`)
      })
    },
    [router, searchParams]
  )

  const clearFilters = useCallback(() => {
    startTransition(() => {
      router.push("/")
    })
  }, [router])

  const hasFilters = search || team !== "all" || category !== "all" || attendance !== "all"

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => updateParams("search", e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={team} onValueChange={(v) => updateParams("team", v)}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            {teams.map((t) => (
              <SelectItem key={t} value={t.toString()}>
                Team {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={category} onValueChange={(v) => updateParams("category", v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={attendance} onValueChange={(v) => updateParams("attendance", v)}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Attendance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="present">Present</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            disabled={isPending}
            className="h-9 px-2 text-muted-foreground hover:text-foreground"
          >
            <X className="mr-1 size-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
