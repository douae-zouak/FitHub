import mongoose, { Document, Schema } from "mongoose";

export interface ICustomerSegment extends Document {
  user: mongoose.Types.ObjectId;
  recency: number;
  frequency: number;
  sales: number;
  isOutlier: boolean;
  cluster: number; // -1 pour outlier
  updatedAt: Date;
}

const CustomerSegmentSchema = new Schema<ICustomerSegment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // 1 user = 1 segment actif
      index: true,
    },
    recency: {
      type: Number,
      required: true,
    },
    frequency: {
      type: Number,
      required: true,
    },
    sales: {
      type: Number,
      required: true,
    },
    isOutlier: {
      type: Boolean,
      required: true,
      index: true,
    },
    cluster: {
      type: Number,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true, // createdAt / updatedAt
  }
);

export default mongoose.model<ICustomerSegment>(
  "CustomerSegment",
  CustomerSegmentSchema
);
