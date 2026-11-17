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
    <ExcalidrawCanvas
      title={drawing.title}
      backHref="/explore"
      mode="public"
      initialData={drawing.data}
      liveShareId={shareId}
      liveSince={drawing.updatedAt}
      actions={
        author ? (
          <Link
            href={`/u/${author.handle}`}
            className="text-xs font-bold text-[#868e96] hover:text-brand"
          >
            by {author.name}
          </Link>
        ) : undefined
      }
    />
  );
}