"use client";

import Link from "next/link";
import type { MenuItem } from "./menu-types";

interface Props {
  menuItems: MenuItem[];
}

function IconChevronDown({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

export default function DesktopNav({ menuItems }: Props) {
  return (
    <nav className="hidden lg:flex items-center ml-8 gap-0">
      {menuItems.map((item, idx) => {
        // MEGA MENU item
        if (item.type === "mega" && item.columns) {
          return (
            <div key={idx} className="relative group">
              <Link
                href={item.href}
                className="flex items-center gap-1 px-3 py-5 text-[13px] font-bold tracking-wide uppercase text-white/80 hover:text-white transition-colors"
              >
                {item.label}
                <IconChevronDown className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
              </Link>
              {/* Mega dropdown */}
              <div
                className="
                  absolute top-full left-1/2 -translate-x-1/2 pt-0
                  opacity-0 invisible
                  group-hover:opacity-100 group-hover:visible
                  transition-all duration-200 ease-out
                  z-50
                "
                style={{ width: "calc(100vw - 2rem)", maxWidth: "1200px" }}
              >
                <div
                  className="bg-white rounded-b-lg shadow-2xl border border-gray-200 border-t-2 border-t-[var(--store-primary)] p-6"
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${item.columns.length}, 1fr)`,
                    gap: "2rem",
                  }}
                >
                  {item.columns.map((col) => (
                    <div key={col.title}>
                      <h4 className="font-bold text-gray-900 text-sm mb-3 pb-2 border-b border-gray-200">
                        {col.title}
                      </h4>
                      <ul className="space-y-1.5">
                        {col.items.map((sub) => (
                          <li key={sub.name}>
                            <Link
                              href={sub.href}
                              className="block text-sm text-gray-600 hover:text-[var(--store-primary)] hover:pl-1 py-0.5 transition-all duration-150"
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        // SIMPLE DROPDOWN item
        if (item.type === "dropdown" && item.items) {
          return (
            <div key={idx} className="relative group">
              <Link
                href={item.href}
                className="flex items-center gap-1 px-3 py-5 text-[13px] font-bold tracking-wide uppercase text-white/80 hover:text-white transition-colors"
              >
                {item.label}
                <IconChevronDown className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
              </Link>
              {/* Simple vertical dropdown */}
              <div
                className="
                  absolute top-full left-0 pt-0
                  opacity-0 invisible
                  group-hover:opacity-100 group-hover:visible
                  transition-all duration-200 ease-out
                  z-50 min-w-[200px]
                "
              >
                <div className="bg-white rounded-b-lg shadow-2xl border border-gray-200 border-t-2 border-t-[var(--store-primary)] py-2">
                  {item.items.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--store-primary)] transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        // DIRECT LINK item (no dropdown)
        return (
          <Link
            key={idx}
            href={item.href}
            className="px-3 py-5 text-[13px] font-bold tracking-wide uppercase text-white/80 hover:text-white transition-colors"
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
