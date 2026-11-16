import LocalCanvas from "@/components/LocalCanvas";

export default async function LocalDrawPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LocalCanvas id={id} />;
}