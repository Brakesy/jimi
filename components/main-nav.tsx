"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/reviews", label: "Reviews" },
    { href: "/database", label: "Database" },
    { href: "/imported-strains", label: "Imported Strains" },
    { href: "/database-check", label: "Database Check" },
    { href: "/add-review", label: "Add Review" },
    { href: "/profile", label: "Profile" },
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href ? "text-primary" : "text-muted-foreground",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

