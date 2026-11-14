import Link from "next/link";
import { notFound } from "next/navigation";
import ExcalidrawCanvas from "@/components/ExcalidrawCanvas";
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
      <header className="flex h-[65px] items-center gap-4 border-b border-gray-200 px-6">
        <Link href="/dashboard" className="text-sm hover:underline">
          ← My Boards
        </Link>
        <h1 className="truncate font-semibold">{drawing.title}</h1>
      </header>
      <ExcalidrawCanvas id={drawing.id} initialData={drawing.data} />
    </>
  );
}