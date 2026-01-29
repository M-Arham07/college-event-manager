import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import AllowedUser from "@/lib/models/allowedUser"

// Sample allowed users
const sampleAllowedUsers = [
  { email: "admin@example.com", name: "Admin User" },
  { email: "user@example.com", name: "Test User" },
  { email: "delegate@example.com", name: "Delegate Manager" },
]

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Seed route is only available in development" },
      { status: 403 }
    )
  }

  try {
    await connectDB()

    // Clear existing allowed users
    await AllowedUser.deleteMany({})

    // Insert sample allowed users
    const result = await AllowedUser.insertMany(sampleAllowedUsers)

    return NextResponse.json({
      success: true,
      message: `Seeded ${result.length} allowed users`,
      insertedCount: result.length,
      emails: sampleAllowedUsers.map((u) => u.email),
    })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json(
      { error: "Failed to seed allowed users" },
      { status: 500 }
    )
  }
}
