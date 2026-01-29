"use server"

import { revalidatePath } from "next/cache"
import connectDB from "@/lib/mongodb"
import Delegate from "@/lib/models/delegate"

export interface DelegationPayload {
  delegate_1_name: string
  delegate_1_category: string | null
  delegate_2_name?: string
  delegate_2_category: string | null
  delegate_3_name?: string
  delegate_3_category: string | null
  delegate_4_name?: string
  delegate_4_category: string | null
  delegate_5_name?: string
  delegate_5_category: string | null
  include_delegate_2: boolean
  include_delegate_3: boolean
  include_delegate_4: boolean
  include_delegate_5: boolean
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

    // Validate delegate 4 if included
    let delegate4Name: string | null = null
    if (payload.include_delegate_4) {
      delegate4Name = payload.delegate_4_name?.trim() || ""
      if (!delegate4Name) {
        return { success: false, error: "Delegate 4 name is required when included" }
      }
    }

    // Validate delegate 5 if included
    let delegate5Name: string | null = null
    if (payload.include_delegate_5) {
      delegate5Name = payload.delegate_5_name?.trim() || ""
      if (!delegate5Name) {
        return { success: false, error: "Delegate 5 name is required when included" }
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
        category: payload.delegate_1_category || null,
        attendance: { day1: false, day2: false, day3: false },
      },
    ]

    if (payload.include_delegate_2 && delegate2Name) {
      documents.push({
        team_id: teamId,
        delegate_name: delegate2Name,
        category: payload.delegate_2_category || null,
        attendance: { day1: false, day2: false, day3: false },
      })
    }

    if (payload.include_delegate_3 && delegate3Name) {
      documents.push({
        team_id: teamId,
        delegate_name: delegate3Name,
        category: payload.delegate_3_category || null,
        attendance: { day1: false, day2: false, day3: false },
      })
    }

    if (payload.include_delegate_4 && delegate4Name) {
      documents.push({
        team_id: teamId,
        delegate_name: delegate4Name,
        category: payload.delegate_4_category || null,
        attendance: { day1: false, day2: false, day3: false },
      })
    }

    if (payload.include_delegate_5 && delegate5Name) {
      documents.push({
        team_id: teamId,
        delegate_name: delegate5Name,
        category: payload.delegate_5_category || null,
        attendance: { day1: false, day2: false, day3: false },
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
