import { AlertCircle, Compass } from "lucide-react";
import CreatorSearch from "@/components/CreatorSearch";

export default function ExplorePage() {
  return (
    <div className="flex flex-1 items-start justify-center bg-[#f8f9fa] px-4 pb-8 pt-6">
      <div
        className="w-full max-w-lg border-2 border-[#1e1e1e] bg-white p-6 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
        style={{ borderRadius: "8px 2px 6px 2px / 2px 6px 2px 8px" }}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#1e1e1e] bg-[#e5dbff] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Compass className="h-8 w-8 text-brand" />
        </div>

        <h1 className="mt-3 font-virgil text-3xl font-bold text-[#1e1e1e]">
          Explore Creators
        </h1>
        <p className="mx-auto mt-1.5 max-w-sm font-virgil text-base leading-snug text-[#495057]">
          Search for authors to explore their public whiteboards, canvas
          drawings, and shared notes.
        </p>

        <CreatorSearch />

        <div
          className="mt-4 flex gap-2.5 border-2 border-dashed border-orange-400 bg-orange-50 p-3 text-left"
          style={{ borderRadius: "6px 2px 6px 2px / 2px 6px 2px 6px" }}
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
          <div>
            <p className="font-virgil text-base font-bold text-orange-700">
              Clerk Username Required
            </p>
            <p className="font-virgil text-sm leading-snug text-orange-600">
              Only creators who have configured a username in their Clerk
              profile can be discovered and have public pages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}