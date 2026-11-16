import Link from "next/link";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-gray-500 sm:flex-row">
        <div className="flex items-center gap-2">
          <Logo size={20} />
          <span>SketchVault · Draw. Save. Share.</span>
        </div>
        <div className="flex gap-5">
          <Link href="/explore" className="hover:text-black">
            Explore
          </Link>
          <Link href="/dashboard" className="hover:text-black">
            My Boards
          </Link>
        </div>
      </div>
    </footer>
  );
}