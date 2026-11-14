import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header className="border-b border-gray-200">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold">
          SketchVault
        </Link>

        <div className="flex items-center gap-5 text-sm">
          <Link href="/explore" className="hover:underline">
            Explore
          </Link>
          <Link href="/dashboard" className="hover:underline">
            My Boards
          </Link>

          <Show when="signed-out">
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <button className="hover:underline">Sign in</button>
            </SignInButton>
            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
              <button className="rounded-md bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-700">
                Sign up
              </button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </nav>
    </header>
  );
}