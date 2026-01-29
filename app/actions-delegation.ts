"use server"

import { revalidatePath } from "next/cache"
import connectDB from "@/lib/mongodb"
import Delegate from "@/lib/models/delegate"

export interface DelegationPayload {
  delegate_1_name: string
  delegate_2_name?: string
  delegate_3_name?: string
  category: string | null
  include_delegate_2: boolean
  include_delegate_3: boolean
}

export interface DelegationResponse {
  success: boolean
  error?: string
  insertedCount?: number
  teamId?: number
}

/**
 * Get the next team ID based on the current maximum
 */
async function getNextTeamId(): Promise<number> {
  await connectDB()
  const maxTeamDelegate = await Delegate.findOne().sort({ team_id: -1 }).lean()
  return (maxTeamDelegate?.team_id || 0) + 1
}

/**
 * Add a new delegation (1-3 delegates in a single team)
 */
export async function addDelegation(payload: DelegationPayload): Promise<DelegationResponse> {
  try {
    // Validate delegate 1 (required)
    const delegate1Name = payload.delegate_1_name.trim()
    if (!delegate1Name) {
      return { success: false, error: "Delegate 1 name is required" }
    }

    // Validate delegate 2 if included
    let delegate2Name: string | null = null
    if (payload.include_delegate_2) {
      delegate2Name = payload.delegate_2_name?.trim() || ""
      if (!delegate2Name) {
        return { success: false, error: "Delegate 2 name is required when included" }
      }
    }

    // Validate delegate 3 if included
    let delegate3Name: string | null = null
    if (payload.include_delegate_3) {
      delegate3Name = payload.delegate_3_name?.trim() || ""
      if (!delegate3Name) {
        return { success: false, error: "Delegate 3 name is required when included" }
      }
    }

    await connectDB()

    // Get the next team ID
    const teamId = await getNextTeamId()

    // Build documents array
    const documents = [
      {
        team_id: teamId,
        delegate_name: delegate1Name,
        category: payload.category || null,
        attendance: false,
      },
    ]

    if (payload.include_delegate_2 && delegate2Name) {
      documents.push({
        team_id: teamId,
        delegate_name: delegate2Name,
        category: payload.category || null,
        attendance: false,
      })
    }

    if (payload.include_delegate_3 && delegate3Name) {
      documents.push({
        team_id: teamId,
        delegate_name: delegate3Name,
        category: payload.category || null,
        attendance: false,
      })
    }

    // Insert documents
    const result = await Delegate.insertMany(documents)

    // Revalidate the page to refresh data
    revalidatePath("/")

    return {
      success: true,
      insertedCount: result.length,
      teamId,
    }
  } catch (error) {
    console.error("Error adding delegation:", error)
    return { success: false, error: "Failed to add delegation" }
  }
}
