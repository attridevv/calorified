"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Utensils, Weight, CalendarDays, Target } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Log", href: "/log", icon: Utensils },
  { name: "Body", href: "/body", icon: Weight },
  { name: "Weekly", href: "/weekly", icon: CalendarDays },
  { name: "Coach", href: "/coach", icon: Target },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur border-t border-zinc-800 z-50">
      <div className="flex justify-around py-2 px-1">
        {navigation.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] ${active ? "text-amber-400" : "text-zinc-500"}`}>
              <item.icon className="h-5 w-5" />
              <span className="truncate max-w-14">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
