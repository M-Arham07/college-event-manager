"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle, BookOpen } from "lucide-react"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Setup Guide</h1>
          <p className="text-muted-foreground">Get started with Misaal Attendance</p>
        </div>

        <div className="space-y-4">
          <Card className="border-border bg-card p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-1 h-5 w-5 text-warning" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Prerequisites</h3>
                  <p className="text-sm text-muted-foreground">
                    Make sure you have configured all environment variables:
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground list-inside list-disc">
                    <li>MONGODB_URI - Your MongoDB connection string</li>
                    <li>GOOGLE_CLIENT_ID - From Google Cloud Console</li>
                    <li>GOOGLE_CLIENT_SECRET - From Google Cloud Console</li>
                    <li>NEXTAUTH_SECRET - Any random secure string</li>
                    <li>NEXTAUTH_URL - Your application URL</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-border bg-card p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Step 1: Seed Sample Data</h3>
              <p className="text-sm text-muted-foreground">
                Populate the database with sample delegates for testing.
              </p>
              <Button asChild className="w-full">
                <a href="/seed">Seed Delegates</a>
              </Button>
            </div>
          </Card>

          <Card className="border-border bg-card p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Step 2: Add Allowed Users</h3>
              <p className="text-sm text-muted-foreground">
                Add email addresses that are allowed to access the application. This endpoint seeded
                default test accounts.
              </p>
              <Button asChild className="w-full">
                <a href="/seed-allowed">Seed Allowed Users</a>
              </Button>
              <div className="mt-3 rounded-lg border border-border bg-muted/50 p-3 text-xs text-muted-foreground">
                <p className="font-medium">Sample accounts created:</p>
                <ul className="mt-2 space-y-1 list-inside list-disc">
                  <li>admin@example.com</li>
                  <li>user@example.com</li>
                  <li>delegate@example.com</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="border-border bg-card p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Step 3: Sign In</h3>
              <p className="text-sm text-muted-foreground">
                Go to the signin page and authenticate with Google using one of the allowed email
                addresses.
              </p>
              <Button asChild className="w-full">
                <a href="/auth/signin">Go to Sign In</a>
              </Button>
            </div>
          </Card>

          <Card className="border-green-500/20 border-l-2 border-l-green-500 bg-card p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-foreground">All Set!</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Once you complete these steps, you can access the attendance dashboard.
              </p>
            </div>
          </Card>

          <Card className="border-border bg-card p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <BookOpen className="mt-1 h-5 w-5 text-muted-foreground" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Google OAuth Setup</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    If you need to set up Google OAuth credentials:
                  </p>
                  <ol className="space-y-2 text-sm text-muted-foreground list-inside list-decimal">
                    <li>Go to Google Cloud Console (console.cloud.google.com)</li>
                    <li>Create a new project</li>
                    <li>Enable Google+ API</li>
                    <li>Create OAuth 2.0 credentials (Web application)</li>
                    <li>Add authorized redirect URIs: {process.env.NEXTAUTH_URL}/api/auth/callback/google</li>
                    <li>Copy Client ID and Secret to environment variables</li>
                  </ol>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
