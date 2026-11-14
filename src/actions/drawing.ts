"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { Drawing } from "@/models/Drawing";

async function requireUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Pehle login karo");
  return userId;
}

export async function createDrawing() {
  const userId = await requireUser();
  await connectDB();
  const drawing = await Drawing.create({ userId });
  revalidatePath("/dashboard");
  return drawing._id.toString();
}

export async function getMyDrawings() {
  const { userId } = await auth();
  if (!userId) return [];

  await connectDB();
  const drawings = await Drawing.find({ userId })
    .sort({ updatedAt: -1 })
    .lean();

  return drawings.map((d) => ({
    id: d._id.toString(),
    title: d.title,
    isPublic: d.isPublic,
    updatedAt: new Date(d.updatedAt ?? Date.now()).toISOString(),
  }));
}

export async function getMyDrawing(id: string) {
  const userId = await requireUser();
  if (!isValidObjectId(id)) return null;

  await connectDB();
  const d = await Drawing.findOne({ _id: id, userId }).lean();
  if (!d) return null;

  return { id: d._id.toString(), title: d.title, data: d.data };
}

export async function saveDrawing(id: string, data: string) {
  const userId = await requireUser();
  if (!isValidObjectId(id)) return;

  await connectDB();
  await Drawing.updateOne({ _id: id, userId }, { data });
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
  await Drawing.deleteOne({ _id: id, userId });
  revalidatePath("/dashboard");
}

export async function togglePublic(id: string) {
  const userId = await requireUser();
  if (!isValidObjectId(id)) return;

  await connectDB();
  const d = await Drawing.findOne({ _id: id, userId });
  if (!d) return;
  d.isPublic = !d.isPublic;
  await d.save();
  revalidatePath("/dashboard");
  revalidatePath("/explore");
}

export async function getPublicDrawings() {
  await connectDB();
  const drawings = await Drawing.find({ isPublic: true })
    .sort({ updatedAt: -1 })
    .limit(50)
    .lean();

  return drawings.map((d) => ({
    id: d._id.toString(),
    title: d.title,
    updatedAt: new Date(d.updatedAt ?? Date.now()).toISOString(),
  }));
}

export async function getPublicDrawing(id: string) {
  if (!isValidObjectId(id)) return null;

  await connectDB();
  const d = await Drawing.findOne({ _id: id, isPublic: true }).lean();
  if (!d) return null;

  return { id: d._id.toString(), title: d.title, data: d.data };
}