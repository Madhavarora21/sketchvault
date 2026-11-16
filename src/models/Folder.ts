import { Schema, models, model, type Model } from "mongoose";

export type FolderDoc = {
  userId: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const FolderSchema = new Schema<FolderDoc>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 60 },
  },
  { timestamps: true }
);

export const Folder: Model<FolderDoc> =
  (models.Folder as Model<FolderDoc>) ||
  model<FolderDoc>("Folder", FolderSchema);