import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Delegate from "@/lib/models/delegate"

// Sample data for seeding
const sampleDelegates = [
  // Team 1
  { team_id: 1, delegate_name: "Alice Johnson", category: "Engineering" },
  { team_id: 1, delegate_name: "Bob Smith", category: "Engineering" },
  { team_id: 1, delegate_name: "Charlie Brown", category: "Design" },
  // Team 2
  { team_id: 2, delegate_name: "Diana Prince", category: "Marketing" },
  { team_id: 2, delegate_name: "Edward Stark", category: "Marketing" },
  { team_id: 2, delegate_name: "Fiona Green", category: "Sales" },
  // Team 3
  { team_id: 3, delegate_name: "George Wilson", category: "Engineering" },
  { team_id: 3, delegate_name: "Hannah Lee", category: "Design" },
  { team_id: 3, delegate_name: "Ivan Petrov", category: "Engineering" },
  // Team 4
  { team_id: 4, delegate_name: "Julia Roberts", category: "HR" },
  { team_id: 4, delegate_name: "Kevin Chen", category: "Finance" },
  { team_id: 4, delegate_name: "Laura Martinez", category: null },
  // Team 5
  { team_id: 5, delegate_name: "Michael Jordan", category: "Operations" },
  { team_id: 5, delegate_name: "Nancy Drew", category: "Operations" },
  { team_id: 5, delegate_name: "Oscar Wilde", category: "Legal" },
  // Team 6
  { team_id: 6, delegate_name: "Patricia Adams", category: "Engineering" },
  { team_id: 6, delegate_name: "Quinn Hughes", category: "Design" },
  { team_id: 6, delegate_name: "Rachel Green", category: null },
  // Team 7
  { team_id: 7, delegate_name: "Samuel Jackson", category: "Marketing" },
  { team_id: 7, delegate_name: "Tina Turner", category: "Sales" },
  // Team 8
  { team_id: 8, delegate_name: "Uma Thurman", category: "HR" },
  { team_id: 8, delegate_name: "Victor Hugo", category: "Finance" },
  { team_id: 8, delegate_name: "Wendy Williams", category: "Engineering" },
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

    // Clear existing data
    await Delegate.deleteMany({})

    // Insert sample data (timestamps are handled by Mongoose)
    const delegates = sampleDelegates.map((d) => ({
      ...d,
      attendance: false,
    }))

    const result = await Delegate.insertMany(delegates)

    return NextResponse.json({
      success: true,
      message: `Seeded ${result.length} delegates`,
      insertedCount: result.length,
    })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    )
  }
}
