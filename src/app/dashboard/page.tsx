import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import NewDrawingButton from "@/components/NewDrawingButton";
import DrawingCard from "@/components/DrawingCard";
import { getMyDrawings } from "@/actions/drawing";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const drawings = await getMyDrawings();

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Boards</h1>
          <NewDrawingButton />
        </div>

        {drawings.length === 0 ? (
          <p className="mt-10 text-gray-500">
            Abhi koi drawing nahi hai. &quot;New Drawing&quot; dabao.
          </p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {drawings.map((d) => (
              <DrawingCard
                key={d.id}
                id={d.id}
                title={d.title}
                isPublic={d.isPublic}
                dateLabel={new Date(d.updatedAt).toLocaleDateString("en-IN", {
                  timeZone: "Asia/Kolkata",
                })}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}