"use client";

import Link from "next/link";
import { useState } from "react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Compass, LayoutGrid, Menu, X } from "lucide-react";
import Logo from "@/components/Logo";

// apni GitHub repo ka link yahan daalo
const REPO_URL = "https://github.com/APNA_USERNAME/sketchvault";

const linkClass =
  "flex items-center gap-2 rounded-lg px-3 py-2 font-virgil text-sm font-medium text-[#1e1e1e] transition-colors hover:bg-[#f3f4f6]";

function GithubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a11.5 11.5 0 0 0-3.63 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a10.9 10.9 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleVisibility() {
    const next = !visible;
    setVisible(next);
    document.body.style.setProperty("--navbar-height", next ? "56px" : "0px");
  }

  return (
    <div style={{ height: "var(--navbar-height, 56px)" }} className="relative">
      <nav
        className={`sticky top-0 z-50 flex w-full flex-col bg-white shadow-sm transition-all duration-300 ease-in-out ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="relative z-50 mx-auto flex h-14 w-full max-w-7xl items-center justify-between bg-white px-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-virgil text-xl font-bold tracking-tight text-[#1e1e1e] transition-opacity hover:opacity-80"
          >
            <Logo size={34} />
            <span className="hidden md:block">SketchVault</span>
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-4 md:flex">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 font-virgil hover:bg-[#d5d5f2]"
            >
              <GithubIcon />
              <span>Star Repo</span>
            </a>
            <Link href="/explore" className={linkClass}>
              <Compass className="h-4 w-4 text-brand" />
              Explore
            </Link>
            <Link href="/dashboard" className={linkClass}>
              <LayoutGrid className="h-4 w-4 text-brand" />
              My Boards
            </Link>

            <Show when="signed-in">
              <div className="border-l border-gray-200 pl-2">
                <UserButton />
              </div>
            </Show>

            <Show when="signed-out">
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="rounded-lg px-4 py-2 font-virgil text-sm font-medium text-[#1e1e1e] transition-colors hover:bg-[#f3f4f6]">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <button
                  className="bg-brand px-4 py-2 font-virgil text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-dark"
                  style={{ borderRadius: "8px 2px 8px 3px / 3px 8px 3px 8px" }}
                >
                  Sign up
                </button>
              </SignUpButton>
            </Show>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-4 md:hidden">
            <Show when="signed-in">
              <UserButton />
            </Show>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-md p-1 text-[#1e1e1e] transition-colors hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div
          className={`absolute left-0 right-0 top-14 z-40 flex-col overflow-hidden border-b border-gray-100 bg-white shadow-md transition-all duration-300 ease-in-out md:hidden ${
            menuOpen ? "max-h-[400px] border-t opacity-100" : "max-h-0 border-transparent opacity-0"
          }`}
        >
          <div className="flex flex-col gap-2 p-4">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 font-virgil hover:bg-[#d5d5f2]"
            >
              <GithubIcon />
              <span>Star Repo</span>
            </a>
            <Link href="/explore" onClick={() => setMenuOpen(false)} className={linkClass}>
              <Compass className="h-4 w-4 text-brand" />
              Explore
            </Link>
            <Link href="/dashboard" onClick={() => setMenuOpen(false)} className={linkClass}>
              <LayoutGrid className="h-4 w-4 text-brand" />
              My Boards
            </Link>
            <Show when="signed-out">
              <div className="my-2 h-px bg-gray-200" />
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="w-full rounded-lg px-4 py-2 text-left font-virgil text-sm font-medium hover:bg-[#f3f4f6]">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <button
                  className="mt-2 w-full bg-brand px-4 py-2 text-center font-virgil text-sm font-medium text-white shadow-sm hover:bg-brand-dark"
                  style={{ borderRadius: "8px 2px 8px 3px / 3px 8px 3px 8px" }}
                >
                  Sign up
                </button>
              </SignUpButton>
            </Show>
          </div>
        </div>
      </nav>

      {/* Navbar chhupane/dikhane wala chhota handle */}
      <button
        onClick={toggleVisibility}
        aria-label="Toggle navbar"
        className={`absolute left-1/2 top-1 z-50 flex h-2 w-14 cursor-pointer items-center justify-center rounded-full bg-neutral-400 transition-all duration-300 ease-in-out hover:bg-sky-200 ${
          visible ? "translate-y-[48px]" : ""
        }`}
      />
    </div>
  );
}