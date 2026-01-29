"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border bg-card p-8">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
          </div>

          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
            <p className="text-sm text-muted-foreground">
             Please contact me on whatsapp 03121497639 for access
            </p>
          </div>

          <p className="rounded-lg border border-border bg-muted p-3 text-xs text-muted-foreground">
            Contact 03121497639 M-Arham07 
          </p>

          <Button
            onClick={() => signOut({ redirect: true, callbackUrl: "/auth/signin" })}
            variant="outline"
            className="w-full"
          >
            Sign out
          </Button>
        </div>
      </Card>
    </div>
  )
}
