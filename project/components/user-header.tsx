"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"

export function UserHeader() {
  const { data: session } = useSession()

  if (!session?.user) {
    return null
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-secondary p-2">
          <User className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{session.user.name}</p>
          <p className="text-xs text-muted-foreground">{session.user.email}</p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => signOut({ redirect: true, callbackUrl: "/auth/signin" })}
        className="gap-2"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </Button>
    </div>
  )
}
