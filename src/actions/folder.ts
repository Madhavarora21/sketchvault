"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { Drawing } from "@/models/Drawing";
import { Folder } from "@/models/Folder";

async function requireUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Please sign in first");
  return userId;
}

function cleanName(name: string) {
  return name.trim().slice(0, 60);
}

export async function createFolder(name: string) {
  const userId = await requireUser();
  const clean = cleanName(name);
  if (!clean) throw new Error("Folder name is required");

  await connectDB();
  const folder = await Folder.create({ userId, name: clean });
  revalidatePath("/dashboard");
  return folder._id.toString();
}

export async function getMyFolders() {
  const { userId } = await auth();
  if (!userId) return [];

  await connectDB();
  const [folders, counts] = await Promise.all([
    Folder.find({ userId }).sort({ name: 1 }).lean(),
    Drawing.aggregate<{ _id: string; n: number }>([
      { $match: { userId, folderId: { $ne: null } } },
      { $group: { _id: "$folderId", n: { $sum: 1 } } },
    ]),
  ]);

  const countMap = new Map(counts.map((c) => [c._id, c.n]));
  return folders.map((f) => ({
    id: f._id.toString(),
    name: f.name,
    count: countMap.get(f._id.toString()) ?? 0,
  }));
}

export async function getMyFolder(id: string) {
  const { userId } = await auth();
  if (!userId || !isValidObjectId(id)) return null;

  await connectDB();
  const f = await Folder.findOne({ _id: id, userId }).lean();
  return f ? { id: f._id.toString(), name: f.name } : null;
}

export async function renameFolder(id: string, name: string) {
  const userId = await requireUser();
  const clean = cleanName(name);
  if (!clean || !isValidObjectId(id)) return;

  await connectDB();
  await Folder.updateOne({ _id: id, userId }, { name: clean });
  revalidatePath("/dashboard");
}

// folder delete hone par uski drawings delete nahi hoti, bahar aa jati hain
export async function deleteFolder(id: string) {
  const userId = await requireUser();
  if (!isValidObjectId(id)) return;

  await connectDB();
  await Drawing.updateMany({ userId, folderId: id }, { folderId: null });
  await Folder.deleteOne({ _id: id, userId });
  revalidatePath("/dashboard");
}

export async function moveDrawing(drawingId: string, folderId: string | null) {
  const userId = await requireUser();
  if (!isValidObjectId(drawingId)) throw new Error("Invalid drawing");

  await connectDB();

  if (folderId) {
    if (!isValidObjectId(folderId)) throw new Error("Invalid folder");
    const owns = await Folder.exists({ _id: folderId, userId });
    if (!owns) throw new Error("Folder not found");
  }

  await Drawing.updateOne({ _id: drawingId, userId }, { folderId: folderId ?? null });
  revalidatePath("/dashboard");
}