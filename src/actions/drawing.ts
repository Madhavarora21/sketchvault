"use server";

import { randomBytes } from "crypto";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { Drawing } from "@/models/Drawing";
import { Folder } from "@/models/Folder";
import { DrawingVersion } from "@/models/DrawingVersion";

const SNAPSHOT_EVERY_MS = 3 * 60 * 1000; // har 3 minute me ek version
const MAX_VERSIONS = 20;

async function requireUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Please sign in first");
  return userId;
}

function newShareId() {
  return randomBytes(9).toString("base64url");
}

export async function createDrawing(folderId?: string | null) {
  const userId = await requireUser();
  await connectDB();

  // folder sirf tab lagao jab wo isi user ka ho
  let safeFolderId: string | null = null;
  if (folderId && isValidObjectId(folderId)) {
    const owns = await Folder.exists({ _id: folderId, userId });
    if (owns) safeFolderId = folderId;
  }

  const drawing = await Drawing.create({ userId, folderId: safeFolderId });
  revalidatePath("/dashboard");
  return drawing._id.toString();
}

// folderId na do to wahi drawings aayengi jo kisi folder me nahi hain
export async function getMyDrawings(folderId?: string | null) {
  const { userId } = await auth();
  if (!userId) return [];

  await connectDB();
  const drawings = await Drawing.find({ userId, folderId: folderId ?? null })
    .sort({ updatedAt: -1 })
    .lean();

  return drawings.map((d) => ({
    id: d._id.toString(),
    title: d.title,
    isPublic: d.isPublic,
    shareId: d.shareId ?? null,
    folderId: d.folderId ?? null,
    updatedAt: new Date(d.updatedAt ?? Date.now()).toISOString(),
  }));
}

export async function getMyDrawing(id: string) {
  const userId = await requireUser();
  if (!isValidObjectId(id)) return null;

  await connectDB();
  const d = await Drawing.findOne({ _id: id, userId }).lean();
  if (!d) return null;

  return {
    id: d._id.toString(),
    title: d.title,
    data: d.data,
    isPublic: d.isPublic,
    shareId: d.shareId ?? null,
  };
}

export async function saveDrawing(id: string, data: string) {
  const userId = await requireUser();
  if (!isValidObjectId(id)) return;

  await connectDB();
  const res = await Drawing.updateOne({ _id: id, userId }, { data });
  if (res.matchedCount === 0) return;

  // version history: har kuch minute me snapshot
  let count = 0;
  try {
    count = JSON.parse(data).length;
  } catch {}
  if (count === 0) return;

  const last = await DrawingVersion.findOne({ drawingId: id })
    .sort({ createdAt: -1 })
    .lean();
  const tooSoon =
    last && Date.now() - new Date(last.createdAt ?? 0).getTime() < SNAPSHOT_EVERY_MS;
  if (tooSoon || last?.data === data) return;

  await DrawingVersion.create({ drawingId: id, userId, data, elementCount: count });

  const old = await DrawingVersion.find({ drawingId: id })
    .sort({ createdAt: -1 })
    .skip(MAX_VERSIONS)
    .select("_id")
    .lean();
  if (old.length > 0) {
    await DrawingVersion.deleteMany({ _id: { $in: old.map((v) => v._id) } });
  }
}

export async function renameDrawing(id: string, title: string) {
  const userId = await requireUser();
  const clean = title.trim().slice(0, 80);
  if (!clean || !isValidObjectId(id)) return;

  await connectDB();
  await Drawing.updateOne({ _id: id, userId }, { title: clean });
  revalidatePath("/dashboard");
}

export async function deleteDrawing(id: string) {
  const userId = await requireUser();
  if (!isValidObjectId(id)) return;

  await connectDB();
  const res = await Drawing.deleteOne({ _id: id, userId });
  if (res.deletedCount > 0) await DrawingVersion.deleteMany({ drawingId: id });
  revalidatePath("/dashboard");
  revalidatePath("/explore");
}

// public/private badlo. Pehli baar public karne par shareId ban jati hai.
export async function setDrawingPublic(id: string, isPublic: boolean) {
  const userId = await requireUser();
  if (!isValidObjectId(id)) throw new Error("Invalid drawing");

  await connectDB();
  const d = await Drawing.findOne({ _id: id, userId });
  if (!d) throw new Error("Drawing not found");

  d.isPublic = isPublic;
  if (isPublic && !d.shareId) d.shareId = newShareId();
  await d.save();

  revalidatePath("/dashboard");
  revalidatePath("/explore");
  return { isPublic: d.isPublic, shareId: d.shareId ?? null };
}

// naya link banao, purana link turant band
export async function regenerateShareLink(id: string) {
  const userId = await requireUser();
  if (!isValidObjectId(id)) throw new Error("Invalid drawing");

  await connectDB();
  const shareId = newShareId();
  const res = await Drawing.updateOne({ _id: id, userId }, { shareId });
  if (res.matchedCount === 0) throw new Error("Drawing not found");

  revalidatePath("/dashboard");
  revalidatePath("/explore");
  return shareId;
}

export async function getPublicDrawings() {
  await connectDB();
  const drawings = await Drawing.find({
    isPublic: true,
    shareId: { $exists: true },
  })
    .sort({ updatedAt: -1 })
    .limit(50)
    .lean();

  return drawings.map((d) => ({
    shareId: d.shareId as string,
    title: d.title,
    userId: d.userId,
    updatedAt: new Date(d.updatedAt ?? Date.now()).toISOString(),
  }));
}

export async function getPublicDrawing(shareId: string) {
  if (!shareId || shareId.length > 40) return null;

  await connectDB();
  const d = await Drawing.findOne({ shareId, isPublic: true }).lean();
  if (!d) return null;

  return {
    title: d.title,
    data: d.data,
    userId: d.userId,
    updatedAt: new Date(d.updatedAt ?? Date.now()).toISOString(),
  };
}

// Live view: viewer ka browser har kuch second me poochta hai "kuch badla?"
export async function getPublicDrawingState(shareId: string, since: string) {
  if (!shareId || shareId.length > 40) return { changed: false as const };

  await connectDB();
  const d = await Drawing.findOne({ shareId, isPublic: true })
    .select("data updatedAt")
    .lean();
  if (!d) return { changed: false as const };

  const updatedAt = new Date(d.updatedAt ?? Date.now()).toISOString();
  if (updatedAt === since) return { changed: false as const };

  return { changed: true as const, updatedAt, data: d.data };
}