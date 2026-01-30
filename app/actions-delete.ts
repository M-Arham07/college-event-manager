"use server"

import { revalidatePath } from "next/cache"
import connectDB from "@/lib/mongodb"
import Delegate from "@/lib/models/delegate"
import { requireEditAccess } from "@/lib/access"

export interface DeleteResponse {
  success: boolean
  error?: string
  deletedCount?: number
}

/**
 * Delete a single delegate by ID
 */
export async function deleteDelegate(id: string): Promise<DeleteResponse> {
  try {
    // Check authorization
    try {
      await requireEditAccess()
    } catch (error) {
      return { success: false, error: "Unauthorized: View-only access" }
    }

    if (!id || typeof id !== "string") {
      return { success: false, error: "Invalid delegate ID" }
    }

    await connectDB()

    const result = await Delegate.deleteOne({ _id: id })

    if (result.deletedCount === 0) {
      return { success: false, error: "Delegate not found" }
    }

    revalidatePath("/")
    return { success: true, deletedCount: 1 }
  } catch (error) {
    console.error("Error deleting delegate:", error)
    return { success: false, error: "Failed to delete delegate" }
  }
}

/**
 * Delete all delegates in a team by team_id
 */
export async function deleteTeam(teamId: number): Promise<DeleteResponse> {
  try {
    // Check authorization
    try {
      await requireEditAccess()
    } catch (error) {
      return { success: false, error: "Unauthorized: View-only access" }
    }

    if (typeof teamId !== "number" || teamId < 1) {
      return { success: false, error: "Invalid team ID" }
    }

    await connectDB()

    const result = await Delegate.deleteMany({ team_id: teamId })

    if (result.deletedCount === 0) {
      return { success: false, error: "Team not found" }
    }

    revalidatePath("/")
    return { success: true, deletedCount: result.deletedCount }
  } catch (error) {
    console.error("Error deleting team:", error)
    return { success: false, error: "Failed to delete team" }
  }
}
