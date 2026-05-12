"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";

export function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const links = [
    { href: "/", label: "Home" },
    { href: "/equipment", label: "Equipment" },
    { href: "/research", label: "Researchers & Publications" },
    { href: "/services", label: "Services" },
    { href: "/projects", label: "Projects" },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <img src="/logo.jpg" alt="Lab Logo" className={styles.logoImg} />
          <span>Herbal Nanotechnology Lab</span>
        </Link>

        {/* Desktop */}
        <div className={styles.desktopNav}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ""
                }`}
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label="Toggle dark mode"
          >
            {mounted ? (
              resolvedTheme === "light" ? (
                <Moon size={20} />
              ) : (
                <Sun size={20} />
              )
            ) : (
              <div style={{ width: 20, height: 20 }} />
            )}
          </button>
        </div>

        {/* Mobile */}
        <div className={styles.mobileNavToggle}>
          <button
            onClick={toggleTheme}
            className={styles.themeToggle}
          >
            {mounted ? (
              resolvedTheme === "light" ? (
                <Moon size={20} />
              ) : (
                <Sun size={20} />
              )
            ) : (
              <div style={{ width: 20, height: 20 }} />
            )}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={styles.menuToggle}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className={styles.mobileNav}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.mobileNavLink} ${pathname === link.href ? styles.active : ""
                }`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}