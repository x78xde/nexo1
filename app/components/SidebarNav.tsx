"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  primaryNavigation,
  secondaryNavigation,
  type NavigationItem,
} from "../lib/sections";

function NavigationGroup({
  title,
  items,
  pathname,
}: {
  title: string;
  items: NavigationItem[];
  pathname: string;
}) {
  return (
    <div className="panel rounded-[18px] p-2.5">
      <p className="px-2.5 pb-2 text-[0.68rem] uppercase tracking-[0.24em] text-zinc-500">
        {title}
      </p>
      <nav className="space-y-1.5">
        {items.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition ${
                active
                  ? "bg-[#242424] text-zinc-100"
                  : "text-zinc-400 hover:bg-[#222222] hover:text-zinc-100"
              }`}
            >
              <Icon
                className={`h-4 w-4 transition ${
                  active ? "text-zinc-100" : "text-zinc-500 group-hover:text-zinc-200"
                }`}
              />
              <span className="flex-1">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="mt-4 grid gap-4 lg:mt-5">
      <NavigationGroup title="Principal" items={primaryNavigation} pathname={pathname} />
      <NavigationGroup title="Sistema" items={secondaryNavigation} pathname={pathname} />
    </div>
  );
}
