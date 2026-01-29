import { MongoClient, Db } from "mongodb"

/**
 * MongoDB connection helper
 * 
 * Required indexes for optimal performance:
 * - { team_id: 1 }
 * - { attendance: 1 }
 * - { category: 1 }
 * - Text index on delegate_name and category for full-text search (optional)
 *   OR use regex with case-insensitive matching (simpler but less performant)
 * 
 * Trade-offs:
 * - Text index: Better performance for large datasets, but only supports word-based matching
 * - Regex: More flexible partial matching, but slower on large datasets
 * - For this app, we use regex with case-insensitive matching for simplicity
 */

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable to preserve the value
  // across module reloads caused by HMR (Hot Module Replacement)
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(MONGODB_URI)
  clientPromise = client.connect()
}

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db("misaal_attendance")
}

export async function getDelegatesCollection() {
  const db = await getDatabase()
  return db.collection("delegates")
}

export default clientPromise
