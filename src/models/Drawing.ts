import { Schema, models, model, type Model } from "mongoose";

export type DrawingDoc = {
  userId: string;
  title: string;
  data: string;
  isPublic: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

const DrawingSchema = new Schema<DrawingDoc>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, default: "Untitled" },
    data: { type: String, default: "[]" },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Drawing: Model<DrawingDoc> =
  (models.Drawing as Model<DrawingDoc>) ||
  model<DrawingDoc>("Drawing", DrawingSchema);