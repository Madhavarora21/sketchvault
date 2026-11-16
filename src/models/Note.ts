import { Schema, models, model, type Model } from "mongoose";

export type NoteDoc = {
  userId: string;
  title: string;
  content: string;
  isPublic: boolean;
  shareId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const NoteSchema = new Schema<NoteDoc>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, default: "Untitled note", maxlength: 120 },
    content: { type: String, default: "" },
    isPublic: { type: Boolean, default: false },
    shareId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

export const Note: Model<NoteDoc> =
  (models.Note as Model<NoteDoc>) || model<NoteDoc>("Note", NoteSchema);