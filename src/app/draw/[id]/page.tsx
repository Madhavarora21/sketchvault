import { notFound } from "next/navigation";
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
    <ExcalidrawCanvas
      id={drawing.id}
      title={drawing.title}
      backHref="/dashboard"
      mode="cloud"
      initialData={drawing.data}
      actions={
        <>
          <HistoryButton drawingId={drawing.id} />
          <ShareButton
            id={drawing.id}
            isPublic={drawing.isPublic}
            shareId={drawing.shareId}
          />
        </>
      }
    />
  );
}