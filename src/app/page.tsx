import Link from "next/link";
import { Show, SignInButton } from "@clerk/nextjs";
import { ArrowRight, Cloud, History, Share2 } from "lucide-react";

const features = [
  {
    icon: Cloud,
    title: "Cloud Sync",
    text: "Sign in to save your drawings to the cloud. Pick up where you left off on any device.",
  },
  {
    icon: History,
    title: "Version History",
    text: "Every save creates a snapshot. Restore any previous version of your drawing.",
  },
  {
    icon: Share2,
    title: "Share Instantly",
    text: "Generate a public link and share your board with anyone — no login required to view.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col font-virgil">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center bg-white px-4 pb-20 pt-24 text-center">
        <div
          className="mb-8 inline-block border-2 border-brand-soft bg-brand-light px-4 py-1.5 text-sm font-bold text-brand"
          style={{ borderRadius: "40px 8px 36px 12px / 12px 36px 8px 40px" }}
        >
          ✨ Free to use · No sign-up required
        </div>

        <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-[#1e1e1e] sm:text-6xl">
          A virtual whiteboard
          <br />
          <span
            className="text-brand underline"
            style={{ textDecorationStyle: "wavy", textDecorationColor: "#9b96f0" }}
          >
            for your ideas
          </span>
        </h1>

        <p className="mb-10 max-w-xl font-sans text-lg leading-relaxed text-[#495057]">
          Sketch, diagram, and brainstorm with an infinite canvas. Save to cloud
          and share with anyone — or just draw freely.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/local"
            className="flex items-center gap-2 bg-brand px-8 py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-brand-dark"
            style={{ borderRadius: "12px 4px 10px 4px / 4px 10px 4px 12px" }}
          >
            Start drawing — it&apos;s free
            <ArrowRight className="h-5 w-5" />
          </Link>

          <Show when="signed-out">
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <button
                className="flex items-center gap-2 border-2 border-brand bg-white px-8 py-3.5 text-base font-bold text-brand transition-all hover:bg-brand-light"
                style={{ borderRadius: "4px 12px 4px 10px / 10px 4px 12px 4px" }}
              >
                Sign in to save
              </button>
            </SignInButton>
          </Show>

          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 border-2 border-brand bg-white px-8 py-3.5 text-base font-bold text-brand transition-all hover:bg-brand-light"
              style={{ borderRadius: "4px 12px 4px 10px / 10px 4px 12px 4px" }}
            >
              My Dashboard
            </Link>
          </Show>
        </div>
      </section>

      {/* Features */}
      <section className="border-t-2 border-dashed border-[#e9ecef] bg-[#f8f9fa] px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-14 text-center text-3xl font-bold text-[#1e1e1e]">
            Everything you need
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="border-2 border-[#e9ecef] bg-white p-6 shadow-sm transition-colors hover:border-brand hover:shadow-md"
                style={{ borderRadius: "8px 2px 6px 2px / 2px 6px 2px 8px" }}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-light">
                  <Icon className="h-6 w-6 text-brand" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#1e1e1e]">{title}</h3>
                <p className="font-sans text-sm leading-relaxed text-[#868e96]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}