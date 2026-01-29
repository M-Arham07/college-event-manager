import mongoose from "mongoose"

const allowedUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
)

const AllowedUser =
  mongoose.models.AllowedUser || mongoose.model("AllowedUser", allowedUserSchema)

export default AllowedUser
