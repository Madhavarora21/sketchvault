import Link from "next/link";
import { Cloud, FileText, HardDrive } from "lucide-react";

export type DashboardTab = "cloud" | "notes" | "local";

const tabs = [
  { key: "cloud" as const, label: "Cloud", href: "/dashboard", Icon: Cloud },
  { key: "notes" as const, label: "Notes", href: "/dashboard?tab=notes", Icon: FileText },
  { key: "local" as const, label: "Local", href: "/dashboard?tab=local", Icon: HardDrive },
];

export default function DashboardTabs({ active }: { active: DashboardTab }) {
  return (
    <div className="mt-8 flex gap-2 border-b-2 border-dashed border-[#e9ecef]">
      {tabs.map(({ key, label, href, Icon }) => (
        <Link
          key={key}
          href={href}
          className={`-mb-0.5 flex items-center gap-2 border-b-2 px-4 py-2 font-virgil text-sm font-bold transition-colors ${
            active === key
              ? "border-brand text-brand"
              : "border-transparent text-[#868e96] hover:text-[#1e1e1e]"
          }`}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </div>
  );
}