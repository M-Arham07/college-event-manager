import mongoose from "mongoose"

declare global {
  var mongooseConnection: typeof mongoose | undefined
}

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

/**
 * Mongoose connection helper with hot module reloading support
 * In development, reuses the connection across module reloads
 * In production, creates a single connection
 */
async function connectDB() {
  if (global.mongooseConnection) {
    return global.mongooseConnection
  }

  const connection = await mongoose.connect(MONGODB_URI, {
    dbName: "misaal_attendance",
  })

  if (process.env.NODE_ENV === "development") {
    global.mongooseConnection = connection
  }

  return connection
}

export default connectDB
