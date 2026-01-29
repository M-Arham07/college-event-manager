import mongoose, { Schema, Document, Model } from "mongoose"

export interface IDelegateDocument extends Document {
  team_id: number
  delegate_name: string
  category: string | null
  attendance: {
    day1: boolean
    day2: boolean
    day3: boolean
  }
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
      type: {
        day1: { type: Boolean, default: false },
        day2: { type: Boolean, default: false },
        day3: { type: Boolean, default: false },
      },
      default: { day1: false, day2: false, day3: false },
    },
  },
  {
    timestamps: true,
  }
)

const Delegate: Model<IDelegateDocument> =
  mongoose.models.Delegate || mongoose.model<IDelegateDocument>("Delegate", delegateSchema)

export default Delegate
