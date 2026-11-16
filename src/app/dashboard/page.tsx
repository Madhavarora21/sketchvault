import { Suspense } from "react";
import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import NewDrawingButton from "@/components/NewDrawingButton";
import NewFolderButton from "@/components/NewFolderButton";
import NewNoteButton from "@/components/NewNoteButton";
import DashboardTabs, { type DashboardTab } from "@/components/DashboardTabs";
import CloudDrawings from "@/components/CloudDrawings";
import NotesList from "@/components/NotesList";
import LocalBoards from "@/components/LocalBoards";
import { CardsSkeleton } from "@/components/DrawingCardSkeleton";
import { getMyFolder } from "@/actions/folder";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; folder?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { tab, folder: folderParam } = await searchParams;
  const active: DashboardTab =
    tab === "local" ? "local" : tab === "notes" ? "notes" : "cloud";

  // ?folder=<id> hai to check karo ki wo folder is user ka hai
  const folder =
    active === "cloud" && folderParam ? await getMyFolder(folderParam) : null;
  if (folderParam && active === "cloud" && !folder) redirect("/dashboard");

  const user = await currentUser();
  const profileHandle = user?.username ?? userId;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          {folder && (
            <Link
              href="/dashboard"
              className="mb-1 flex items-center gap-1.5 font-virgil text-sm text-[#868e96] hover:text-brand"
            >
              <ArrowLeft className="h-4 w-4" />
              All boards
            </Link>
          )}
          <h1 className="font-virgil text-3xl font-bold text-[#1e1e1e]">
            {folder ? folder.name : "My Dashboard"}
          </h1>
          <Link
            href={`/u/${profileHandle}`}
            className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-[#868e96] hover:text-brand"
          >
            <User className="h-3.5 w-3.5" />
            View my public profile
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {active === "cloud" && !folder && <NewFolderButton />}
          {active === "cloud" && <NewDrawingButton folderId={folder?.id ?? null} />}
          {active === "notes" && <NewNoteButton />}
        </div>
      </div>

      <DashboardTabs active={active} />

      {active === "cloud" && (
        <Suspense fallback={<CardsSkeleton />}>
          <CloudDrawings folderId={folder?.id ?? null} />
        </Suspense>
      )}
      {active === "notes" && (
        <Suspense fallback={<CardsSkeleton />}>
          <NotesList />
        </Suspense>
      )}
      {active === "local" && <LocalBoards embedded />}
    </div>
  );
}