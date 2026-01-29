"use server"

import { revalidatePath } from "next/cache"
import connectDB from "@/lib/mongodb"
import Delegate from "@/lib/models/delegate"

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

    await connectDB()

    const delegate = await Delegate.findByIdAndUpdate(
      id,
      { attendance, updatedAt: new Date() },
      { new: true }
    )

    if (!delegate) {
      return { success: false, error: "Delegate not found" }
    }

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error toggling attendance:", error)
    return { success: false, error: "Failed to update attendance" }
  }
}
