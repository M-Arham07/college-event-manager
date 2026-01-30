'use server'

import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import AllowedUser from '@/lib/models/allowedUser'

export interface AccessMode {
  mode: 'view' | 'edit'
  email?: string | null
}

/**
 * Get the access mode for the current user
 * Checks if user is signed in and if their email exists in allowedusers collection
 */
export async function getAccessMode(): Promise<AccessMode> {
  try {
    const session = await getServerSession()

    // No session = view-only
    if (!session?.user?.email) {
      return { mode: 'view', email: null }
    }

    const email = session.user.email.trim().toLowerCase()

    try {
      await connectDB()
      const allowedUser = await AllowedUser.findOne({ email })

      if (allowedUser) {
        return { mode: 'edit', email }
      }

      // Signed in but not in allowedusers = view-only
      return { mode: 'view', email }
    } catch (error) {
      console.error('Error checking access:', error)
      return { mode: 'view', email }
    }
  } catch (error) {
    console.error('Error getting session:', error)
    return { mode: 'view', email: null }
  }
}

/**
 * Require edit access - throw error if user is view-only
 * Use this in all mutation server actions
 */
export async function requireEditAccess(): Promise<{ email: string }> {
  const access = await getAccessMode()

  if (access.mode !== 'edit') {
    throw new Error('View-only access')
  }

  return { email: access.email || '' }
}
