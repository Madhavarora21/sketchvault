import { Schema, models, model, type Model } from "mongoose";

export type DrawingVersionDoc = {
  drawingId: string;
  userId: string;
  data: string;
  elementCount: number;
  createdAt?: Date;
};

const DrawingVersionSchema = new Schema<DrawingVersionDoc>(
  {
    drawingId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    data: { type: String, required: true },
    elementCount: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const DrawingVersion: Model<DrawingVersionDoc> =
  (models.DrawingVersion as Model<DrawingVersionDoc>) ||
  model<DrawingVersionDoc>("DrawingVersion", DrawingVersionSchema);