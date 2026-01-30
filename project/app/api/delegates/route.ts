import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Delegate from '@/lib/models/delegate'

export interface DelegateDTO {
  id: string
  team_id: number
  delegate_name: string
  category: string | null
  attendance: {
    day1: boolean
    day2: boolean
    day3: boolean
  }
}

export async function GET() {
  try {
    await connectDB()

    const delegates = await Delegate.find({}).lean()

    // Convert to JSON-safe DTO format
    const delegateDTOs: DelegateDTO[] = delegates.map((doc: any) => ({
      id: doc._id.toString(),
      team_id: doc.team_id,
      delegate_name: doc.delegate_name,
      category: doc.category || null,
      attendance: {
        day1: doc.attendance?.day1 || false,
        day2: doc.attendance?.day2 || false,
        day3: doc.attendance?.day3 || false,
      },
    }))

    return NextResponse.json(delegateDTOs)
  } catch (error) {
    console.error('Error fetching delegates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch delegates' },
      { status: 500 }
    )
  }
}
