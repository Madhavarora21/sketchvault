import Link from "next/link";
import { notFound } from "next/navigation";
import ExcalidrawCanvas from "@/components/ExcalidrawCanvas";
import { getPublicDrawing } from "@/actions/drawing";
import { getAuthors } from "@/actions/profile";

export default async function SharedDrawingPage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;
  const drawing = await getPublicDrawing(shareId);
  if (!drawing) notFound();

  const author = (await getAuthors([drawing.userId]))[drawing.userId];

  return (
    <>
      <header className="flex h-[65px] items-center justify-between gap-4 border-b border-gray-200 px-6">
        <div className="min-w-0">
          <h1 className="truncate font-virgil font-bold">{drawing.title}</h1>
          {author && (
            <Link
              href={`/u/${author.handle}`}
              className="text-xs text-[#868e96] hover:text-brand"
            >
              by {author.name}
            </Link>
          )}
        </div>
        <Link href="/" className="font-virgil text-sm hover:text-brand">
          Made with SketchVault
        </Link>
      </header>
      <ExcalidrawCanvas
        initialData={drawing.data}
        readOnly
        liveShareId={shareId}
        liveSince={drawing.updatedAt}
      />
    </>
  );
}