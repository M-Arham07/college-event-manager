"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border bg-card p-8">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold text-foreground">Misaal Attendance</h1>
            <p className="text-sm text-muted-foreground">Sign in to continue</p>
          </div>

          <Button
            onClick={() => signIn("google", { redirect: true, callbackUrl: "/" })}
            className="w-full"
            size="lg"
          >
            Sign in with Google
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            You need special access to use this application. Please use your authorized email
            address.
          </p>
        </div>
      </Card>
    </div>
  )
}
