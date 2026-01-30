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
              Your email is not authorized to access this application.
            </p>
          </div>

          <p className="rounded-lg border border-border bg-muted p-3 text-xs text-muted-foreground">
            If you believe you should have access, please contact your administrator.
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
