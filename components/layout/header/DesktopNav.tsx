"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { MenuItem } from "./menu-types";

interface Props {
  menuItems: MenuItem[];
  scrolled?: boolean;
  isHome?: boolean;
}

function IconChevronDown({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

export default function DesktopNav({ menuItems, scrolled = false, isHome = false }: Props) {
  // Determine text colors based on scroll state and page
  const textColor = isHome && !scrolled ? "text-white/80 hover:text-white" : "text-foreground/70 hover:text-foreground";
  const textStyle = isHome && !scrolled ? { color: "rgba(255,255,255,0.8)" } : { color: "var(--muted)" };
  const hoverStyle = isHome && !scrolled ? { color: "white" } : { color: "var(--foreground)" };

  return (
    <nav className="hidden lg:flex items-center ml-8 gap-0">
      {menuItems.map((item, idx) => {
        // MEGA MENU item
        if (item.type === "mega" && item.columns) {
          return (
            <div key={idx} className="relative group">
              <Link
                href={item.href}
                className="flex items-center gap-1.5 px-4 py-4 text-[13px] font-medium tracking-wide transition-colors"
                style={textStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, textStyle)}
              >
                {item.label}
                <IconChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-200" />
              </Link>
              {/* Mega dropdown - Apple style */}
              <motion.div
                className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out z-50"
                style={{ width: "calc(100vw - 4rem)", maxWidth: "900px" }}
                initial={{ y: -10 }}
                animate={{ y: 0 }}
              >
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: "var(--surface-solid)",
                    boxShadow: "0 20px 60px -12px rgba(0,0,0,0.2)",
                    border: "1px solid var(--border)",
                    display: "grid",
                    gridTemplateColumns: `repeat(${item.columns.length}, 1fr)`,
                    gap: "2rem",
                  }}
                >
                  {item.columns.map((col) => (
                    <div key={col.title}>
                      <h4 
                        className="font-semibold text-sm mb-4"
                        style={{ color: "var(--foreground)" }}
                      >
                        {col.title}
                      </h4>
                      <ul className="space-y-2">
                        {col.items.map((sub) => (
                          <li key={sub.name}>
                            <Link
                              href={sub.href}
                              className="block text-sm py-1 transition-colors duration-150"
                              style={{ color: "var(--muted)" }}
                              onMouseEnter={(e) => e.currentTarget.style.color = "var(--store-primary)"}
                              onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          );
        }

        // SIMPLE DROPDOWN item
        if (item.type === "dropdown" && item.items) {
          return (
            <div key={idx} className="relative group">
              <Link
                href={item.href}
                className="flex items-center gap-1.5 px-4 py-4 text-[13px] font-medium tracking-wide transition-colors"
                style={textStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, textStyle)}
              >
                {item.label}
                <IconChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-200" />
              </Link>
              {/* Simple dropdown - Apple style */}
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out z-50 min-w-[220px]">
                <div 
                  className="rounded-xl py-2"
                  style={{
                    background: "var(--surface-solid)",
                    boxShadow: "0 20px 60px -12px rgba(0,0,0,0.2)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {item.items.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      className="block px-4 py-2.5 text-sm transition-colors"
                      style={{ color: "var(--muted)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--foreground)";
                        e.currentTarget.style.background = "var(--surface)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--muted)";
                        e.currentTarget.style.background = "transparent";
                      }}
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
            className="px-4 py-4 text-[13px] font-medium tracking-wide transition-colors"
            style={textStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, textStyle)}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
