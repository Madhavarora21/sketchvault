import { Schema, models, model, type Model } from "mongoose";

export type DrawingDoc = {
  userId: string;
  title: string;
  data: string;
  isPublic: boolean;
  shareId?: string;
  folderId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

const DrawingSchema = new Schema<DrawingDoc>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, default: "Untitled" },
    data: { type: String, default: "[]" },
    isPublic: { type: Boolean, default: false },
    // public link ke liye alag id (regenerate karne par purana link band ho jata hai)
    shareId: { type: String, unique: true, sparse: true },
    // kis folder me hai (null = kisi folder me nahi)
    folderId: { type: String, default: null, index: true },
  },
  { timestamps: true }
);

export const Drawing: Model<DrawingDoc> =
  (models.Drawing as Model<DrawingDoc>) ||
  model<DrawingDoc>("Drawing", DrawingSchema);