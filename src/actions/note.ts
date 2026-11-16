"use server";

import { randomBytes } from "crypto";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { Note } from "@/models/Note";

async function requireUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Please sign in first");
  return userId;
}

export async function createNote() {
  const userId = await requireUser();
  await connectDB();
  const note = await Note.create({ userId });
  revalidatePath("/dashboard");
  return note._id.toString();
}

export async function getMyNotes() {
  const { userId } = await auth();
  if (!userId) return [];

  await connectDB();
  const notes = await Note.find({ userId }).sort({ updatedAt: -1 }).lean();
  return notes.map((n) => ({
    id: n._id.toString(),
    title: n.title,
    preview: n.content.replace(/[#>*_`\-\[\]()!]/g, "").slice(0, 120),
    isPublic: n.isPublic,
    updatedAt: new Date(n.updatedAt ?? Date.now()).toISOString(),
  }));
}

export async function getMyNote(id: string) {
  const userId = await requireUser();
  if (!isValidObjectId(id)) return null;

  await connectDB();
  const n = await Note.findOne({ _id: id, userId }).lean();
  if (!n) return null;

  return {
    id: n._id.toString(),
    title: n.title,
    content: n.content,
    isPublic: n.isPublic,
    shareId: n.shareId ?? null,
  };
}

export async function saveNote(id: string, title: string, content: string) {
  const userId = await requireUser();
  if (!isValidObjectId(id)) return;

  await connectDB();
  await Note.updateOne(
    { _id: id, userId },
    { title: title.trim().slice(0, 120) || "Untitled note", content }
  );
}

export async function deleteNote(id: string) {
  const userId = await requireUser();
  if (!isValidObjectId(id)) return;

  await connectDB();
  await Note.deleteOne({ _id: id, userId });
  revalidatePath("/dashboard");
}

export async function setNotePublic(id: string, isPublic: boolean) {
  const userId = await requireUser();
  if (!isValidObjectId(id)) throw new Error("Invalid note");

  await connectDB();
  const n = await Note.findOne({ _id: id, userId });
  if (!n) throw new Error("Note not found");

  n.isPublic = isPublic;
  if (isPublic && !n.shareId) n.shareId = randomBytes(9).toString("base64url");
  await n.save();

  revalidatePath("/dashboard");
  return { isPublic: n.isPublic, shareId: n.shareId ?? null };
}

export async function getPublicNote(shareId: string) {
  if (!shareId || shareId.length > 40) return null;

  await connectDB();
  const n = await Note.findOne({ shareId, isPublic: true }).lean();
  if (!n) return null;

  return {
    title: n.title,
    content: n.content,
    userId: n.userId,
    updatedAt: new Date(n.updatedAt ?? Date.now()).toISOString(),
  };
}

export async function getPublicNotesByUser(userId: string) {
  await connectDB();
  const notes = await Note.find({
    userId,
    isPublic: true,
    shareId: { $exists: true },
  })
    .sort({ updatedAt: -1 })
    .limit(50)
    .lean();

  return notes.map((n) => ({
    shareId: n.shareId as string,
    title: n.title,
    updatedAt: new Date(n.updatedAt ?? Date.now()).toISOString(),
  }));
}