import Link from "next/link";
import { notFound } from "next/navigation";
import ExcalidrawCanvas from "@/components/ExcalidrawCanvas";
import { getPublicDrawing } from "@/actions/drawing";

export default async function SharedDrawingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const drawing = await getPublicDrawing(id);
  if (!drawing) notFound();

  return (
    <>
      <header className="flex h-[65px] items-center justify-between border-b border-gray-200 px-6">
        <h1 className="truncate font-semibold">{drawing.title}</h1>
        <Link href="/" className="text-sm hover:underline">
          Made with SketchVault
        </Link>
      </header>
      <ExcalidrawCanvas initialData={drawing.data} readOnly />
    </>
  );
}