"use server"

import { revalidatePath } from "next/cache"
import connectDB from "@/lib/mongodb"
import Delegate from "@/lib/models/delegate"

export interface DelegationPayload {
  [key: string]: any
  delegate_1_name: string
  delegate_1_category: string | null
  delegate_1_is_head: boolean
  include_delegate_2?: boolean
  include_delegate_3?: boolean
  include_delegate_4?: boolean
  include_delegate_5?: boolean
  include_delegate_6?: boolean
  include_delegate_7?: boolean
  include_delegate_8?: boolean
  include_delegate_9?: boolean
  include_delegate_10?: boolean
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

    // Validate delegates 2-10 if included
    const delegateNames: (string | null)[] = [delegate1Name]
    for (let i = 2; i <= 10; i++) {
      const includeKey = `include_delegate_${i}`
      const nameKey = `delegate_${i}_name`
      const categoryKey = `delegate_${i}_category`

      let delegateName: string | null = null
      if (payload[includeKey]) {
        delegateName = payload[nameKey]?.trim() || ""
        if (!delegateName) {
          return { success: false, error: `Delegate ${i} name is required when included` }
        }
      }
      delegateNames.push(delegateName)
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
        isHead: true,
      },
    ]

    // Add delegates 2-10
    for (let i = 2; i <= 10; i++) {
      const includeKey = `include_delegate_${i}`
      const nameKey = `delegate_${i}_name`
      const categoryKey = `delegate_${i}_category`

      if (payload[includeKey] && delegateNames[i - 1]) {
        documents.push({
          team_id: teamId,
          delegate_name: delegateNames[i - 1],
          category: payload[categoryKey] || null,
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
