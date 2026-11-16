"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { Drawing } from "@/models/Drawing";
import { DrawingVersion } from "@/models/DrawingVersion";

async function requireUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Please sign in first");
  return userId;
}

export async function getVersions(drawingId: string) {
  const userId = await requireUser();
  if (!isValidObjectId(drawingId)) return [];

  await connectDB();
  const owns = await Drawing.exists({ _id: drawingId, userId });
  if (!owns) return [];

  const versions = await DrawingVersion.find({ drawingId })
    .sort({ createdAt: -1 })
    .select("_id elementCount createdAt")
    .lean();

  return versions.map((v) => ({
    id: v._id.toString(),
    elementCount: v.elementCount,
    createdAt: new Date(v.createdAt ?? Date.now()).toISOString(),
  }));
}

export async function restoreVersion(drawingId: string, versionId: string) {
  const userId = await requireUser();
  if (!isValidObjectId(drawingId) || !isValidObjectId(versionId)) {
    throw new Error("Invalid request");
  }

  await connectDB();
  const drawing = await Drawing.findOne({ _id: drawingId, userId });
  if (!drawing) throw new Error("Drawing not found");

  const version = await DrawingVersion.findOne({ _id: versionId, drawingId });
  if (!version) throw new Error("Version not found");

  // abhi ka version bhi save kar lo, taaki restore undo ho sake
  let count = 0;
  try {
    count = JSON.parse(drawing.data).length;
  } catch {}
  if (count > 0) {
    await DrawingVersion.create({
      drawingId,
      userId,
      data: drawing.data,
      elementCount: count,
    });
  }

  drawing.data = version.data;
  await drawing.save();
  revalidatePath("/dashboard");
}