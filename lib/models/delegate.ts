import mongoose, { Schema, Document, Model } from "mongoose"

export interface IDelegateDocument extends Document {
  team_id: number
  delegate_name: string
  category: string | null
  attendance: boolean
  createdAt: Date
  updatedAt: Date
}

const delegateSchema = new Schema<IDelegateDocument>(
  {
    team_id: {
      type: Number,
      required: true,
      index: true,
    },
    delegate_name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: null,
      index: true,
    },
    attendance: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

const Delegate: Model<IDelegateDocument> =
  mongoose.models.Delegate || mongoose.model<IDelegateDocument>("Delegate", delegateSchema)

export default Delegate
