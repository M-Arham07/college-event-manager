"use server"

import { revalidatePath } from "next/cache"
import connectDB from "@/lib/mongodb"
import Delegate from "@/lib/models/delegate"
import { requireEditAccess } from "@/lib/access"
import type { Attendance } from "@/lib/types"

export async function updateAttendance(
  id: string,
  attendance: Attendance
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check authorization
    try {
      await requireEditAccess()
    } catch (error) {
      return { success: false, error: "Unauthorized: View-only access" }
    }

    // Validate input
    if (!id || typeof id !== "string") {
      return { success: false, error: "Invalid delegate ID" }
    }

    if (
      !attendance ||
      typeof attendance.day1 !== "boolean" ||
      typeof attendance.day2 !== "boolean" ||
      typeof attendance.day3 !== "boolean"
    ) {
      return { success: false, error: "Invalid attendance payload" }
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
    console.error("Error updating attendance:", error)
    return { success: false, error: "Failed to update attendance" }
  }
}
