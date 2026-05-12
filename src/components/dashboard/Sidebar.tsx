"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Utensils, Weight, CalendarDays, Target } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Log Food", href: "/log", icon: Utensils },
  { name: "Body Stats", href: "/body", icon: Weight },
  { name: "Weekly", href: "/weekly", icon: CalendarDays },
  { name: "Coach", href: "/coach", icon: Target },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-zinc-900 border-r border-zinc-800 p-5 max-md:hidden flex flex-col">
      <div className="mb-8">
        <h1 className="text-lg font-bold text-amber-400 tracking-tight">CALORIFIED</h1>
        <p className="text-[10px] text-zinc-500 mt-0.5 uppercase tracking-widest">Track. Fuel. Thrive.</p>
      </div>
      <nav className="space-y-0.5 flex-1">
        {navigation.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                active ? "text-zinc-100 bg-zinc-800 font-medium" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
              }`}>
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="pt-4 border-t border-zinc-800 flex items-center gap-3 text-xs text-zinc-500">
        <UserButton />
        <span>Signed in</span>
      </div>
    </aside>
  );
}
