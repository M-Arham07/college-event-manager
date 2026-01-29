"use server"

import { ObjectId } from "mongodb"
import { revalidatePath } from "next/cache"
import { getDelegatesCollection } from "@/lib/mongodb"

export async function toggleAttendance(
  id: string,
  attendance: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate input
    if (!id || typeof id !== "string") {
      return { success: false, error: "Invalid delegate ID" }
    }

    if (typeof attendance !== "boolean") {
      return { success: false, error: "Invalid attendance value" }
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return { success: false, error: "Invalid delegate ID format" }
    }

    const collection = await getDelegatesCollection()
    
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          attendance,
          updatedAt: new Date(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return { success: false, error: "Delegate not found" }
    }

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error toggling attendance:", error)
    return { success: false, error: "Failed to update attendance" }
  }
}
