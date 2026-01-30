"use server"

import { revalidatePath } from "next/cache"
import connectDB from "@/lib/mongodb"
import Delegate from "@/lib/models/delegate"

export interface DelegationPayload {
  delegate_1_name: string
  delegate_1_category: string | null
  delegate_1_is_head: boolean
  delegate_2_name?: string
  delegate_2_category: string | null
  delegate_2_is_head: boolean
  delegate_3_name?: string
  delegate_3_category: string | null
  delegate_3_is_head: boolean
  delegate_4_name?: string
  delegate_4_category: string | null
  delegate_4_is_head: boolean
  delegate_5_name?: string
  delegate_5_category: string | null
  delegate_5_is_head: boolean
  delegate_6_name?: string
  delegate_6_category: string | null
  delegate_6_is_head: boolean
  delegate_7_name?: string
  delegate_7_category: string | null
  delegate_7_is_head: boolean
  delegate_8_name?: string
  delegate_8_category: string | null
  delegate_8_is_head: boolean
  delegate_9_name?: string
  delegate_9_category: string | null
  delegate_9_is_head: boolean
  delegate_10_name?: string
  delegate_10_category: string | null
  delegate_10_is_head: boolean
  include_delegate_2: boolean
  include_delegate_3: boolean
  include_delegate_4: boolean
  include_delegate_5: boolean
  include_delegate_6: boolean
  include_delegate_7: boolean
  include_delegate_8: boolean
  include_delegate_9: boolean
  include_delegate_10: boolean
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

    // Validate delegates 6-10 if included
    const delegateNames: Record<number, string | null> = {
      6: null,
      7: null,
      8: null,
      9: null,
      10: null,
    }

    for (let i = 6; i <= 10; i++) {
      const includeKey = `include_delegate_${i}` as keyof DelegationPayload
      const nameKey = `delegate_${i}_name` as keyof DelegationPayload

      if ((payload[includeKey] as boolean)) {
        const name = (payload[nameKey] as string)?.trim() || ""
        if (!name) {
          return { success: false, error: `Delegate ${i} name is required when included` }
        }
        delegateNames[i] = name
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
        isHead: payload.delegate_1_is_head,
      },
    ]

    if (payload.include_delegate_2 && delegate2Name) {
      documents.push({
        team_id: teamId,
        delegate_name: delegate2Name,
        category: payload.delegate_2_category || null,
        attendance: { day1: false, day2: false, day3: false },
        isHead: payload.delegate_2_is_head,
      })
    }

    if (payload.include_delegate_3 && delegate3Name) {
      documents.push({
        team_id: teamId,
        delegate_name: delegate3Name,
        category: payload.delegate_3_category || null,
        attendance: { day1: false, day2: false, day3: false },
        isHead: payload.delegate_3_is_head,
      })
    }

    if (payload.include_delegate_4 && delegate4Name) {
      documents.push({
        team_id: teamId,
        delegate_name: delegate4Name,
        category: payload.delegate_4_category || null,
        attendance: { day1: false, day2: false, day3: false },
        isHead: payload.delegate_4_is_head,
      })
    }

    if (payload.include_delegate_5 && delegate5Name) {
      documents.push({
        team_id: teamId,
        delegate_name: delegate5Name,
        category: payload.delegate_5_category || null,
        attendance: { day1: false, day2: false, day3: false },
        isHead: payload.delegate_5_is_head,
      })
    }

    // Add delegates 6-10
    for (let i = 6; i <= 10; i++) {
      if (delegateNames[i]) {
        const categoryKey = `delegate_${i}_category` as keyof DelegationPayload
        documents.push({
          team_id: teamId,
          delegate_name: delegateNames[i],
          category: (payload[categoryKey] as string | null) || null,
          attendance: { day1: false, day2: false, day3: false },
          isHead: false,
        })
      }
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
