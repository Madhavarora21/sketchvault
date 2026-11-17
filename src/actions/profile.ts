"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import { Drawing } from "@/models/Drawing";

export type Author = {
  id: string;
  name: string;
  handle: string;
  imageUrl: string;
};

type ClerkUserLike = {
  id: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
};

function toAuthor(u: ClerkUserLike): Author {
  const name =
    [u.firstName, u.lastName].filter(Boolean).join(" ") ||
    u.username ||
    "Anonymous";
  return { id: u.id, name, handle: u.username ?? u.id, imageUrl: u.imageUrl };
}

// handle = Clerk username, ya (username na ho to) user id
export async function getProfileUser(handle: string): Promise<Author | null> {
  if (!handle || handle.length > 80) return null;
  try {
    const client = await clerkClient();
    if (handle.startsWith("user_")) {
      return toAuthor(await client.users.getUser(handle));
    }
    const res = await client.users.getUserList({ username: [handle], limit: 1 });
    return res.data[0] ? toAuthor(res.data[0]) : null;
  } catch {
    return null;
  }
}

export async function getAuthors(userIds: string[]): Promise<Record<string, Author>> {
  const ids = [...new Set(userIds)].slice(0, 100);
  if (ids.length === 0) return {};
  try {
    const client = await clerkClient();
    const res = await client.users.getUserList({ userId: ids, limit: 100 });
    return Object.fromEntries(res.data.map((u) => [u.id, toAuthor(u)]));
  } catch {
    return {};
  }
}

export async function getPublicDrawingsByUser(userId: string) {
  await connectDB();
  const drawings = await Drawing.find({
    userId,
    isPublic: true,
    shareId: { $exists: true },
  })
    .sort({ updatedAt: -1 })
    .limit(60)
    .lean();

  return drawings.map((d) => ({
    shareId: d.shareId as string,
    title: d.title,
    updatedAt: new Date(d.updatedAt ?? Date.now()).toISOString(),
  }));
}


// Explore Creators: username se creator dhoondho (sirf yeh batata hai ki mila ya nahi)
export async function searchCreator(
  input: string
): Promise<{ found: true; handle: string } | { found: false }> {
  const username = input.trim().replace(/^@/, "").toLowerCase();
  if (!username || username.length > 64 || !/^[a-z0-9_.-]+$/.test(username)) {
    return { found: false };
  }

  try {
    const client = await clerkClient();
    const res = await client.users.getUserList({ username: [username], limit: 1 });
    const user = res.data[0];
    return user?.username ? { found: true, handle: user.username } : { found: false };
  } catch {
    return { found: false };
  }
}