import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ExcalidrawCanvas from "@/components/ExcalidrawCanvas";
import ShareButton from "@/components/ShareButton";
import HistoryButton from "@/components/HistoryButton";
import { getMyDrawing } from "@/actions/drawing";

export default async function DrawPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const drawing = await getMyDrawing(id);
  if (!drawing) notFound();

  return (
    <>
      <header className="flex h-[65px] items-center justify-between gap-4 border-b border-gray-200 px-6">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 font-virgil text-sm hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" />
            My Boards
          </Link>
          <h1 className="truncate font-virgil font-bold">{drawing.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <HistoryButton drawingId={drawing.id} />
          <ShareButton
            id={drawing.id}
            isPublic={drawing.isPublic}
            shareId={drawing.shareId}
          />
        </div>
      </header>
      <ExcalidrawCanvas id={drawing.id} initialData={drawing.data} />
    </>
  );
}