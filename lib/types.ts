export interface Attendance {
  day1: boolean
  day2: boolean
  day3: boolean
}

export interface DelegateClient {
  _id: string
  team_id: number
  delegate_name: string
  category: string | null
  isHead: boolean
  attendance: Attendance
  createdAt: string
  updatedAt: string
}

export interface FilterParams {
  search?: string
  team?: string
  category?: string
  attendance?: string
}

export interface DelegateStats {
  total: number
  present: number
  absent: number
  uniqueTeams: number
}
