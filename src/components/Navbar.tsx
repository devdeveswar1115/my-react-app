"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu, X, ChevronDown } from "lucide-react";
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
    { href: "/internships", label: "Internships & Training" },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <div className={styles.logo}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo.jpg" alt="Lab Logo" className={styles.logoImg} />
          </Link>
          <a href="https://soa.ac.in" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/SOA_logo.png" alt="SOA Logo" className={styles.logoImg} style={{ marginLeft: '10px' }} />
          </a>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit', marginLeft: '10px' }}>
            <span>Herbal Nanotechnology Lab</span>
          </Link>
        </div>

        {/* Desktop */}
        <div className={styles.desktopNav}>
          <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}>Home</Link>
          
          <div className={styles.dropdown}>
            <button className={`${styles.navLink} ${styles.dropbtn}`}>
              Know Us <ChevronDown size={14} style={{ marginLeft: '4px' }} />
            </button>
            <div className={styles.dropdownContent}>
              <Link href="/about">About Us</Link>
              <Link href="/equipment">Equipment</Link>
              <Link href="/research">Researchers & Publications</Link>
              <Link href="/projects">Projects</Link>
              <Link href="/achievements">Achievements</Link>
            </div>
          </div>

          <div className={styles.dropdown}>
            <button className={`${styles.navLink} ${styles.dropbtn}`}>
              Services <ChevronDown size={14} style={{ marginLeft: '4px' }} />
            </button>
            <div className={styles.dropdownContent}>
              <Link href="/services">Our Services</Link>
              <Link href="/services/collaborate">Collaborate With Us</Link>
            </div>
          </div>

          <Link href="/internships" className={`${styles.navLink} ${pathname === '/internships' ? styles.active : ''}`}>Internships & Training</Link>
          
          <Link href="/student-resources" className={`${styles.navLink} ${pathname === '/student-resources' ? styles.active : ''}`}>
            Student Resource Hub
          </Link>

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
              resolvedTheme === "light" ? <Moon size={20} /> : <Sun size={20} />
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
          <Link href="/" className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>Home</Link>
          <div style={{ padding: '0.5rem', fontWeight: 'bold' }}>Know Us</div>
          <Link href="/about" className={styles.mobileNavLink} style={{ marginLeft: '1rem' }} onClick={() => setMobileOpen(false)}>About Us</Link>
          <Link href="/equipment" className={styles.mobileNavLink} style={{ marginLeft: '1rem' }} onClick={() => setMobileOpen(false)}>Equipment</Link>
          <Link href="/research" className={styles.mobileNavLink} style={{ marginLeft: '1rem' }} onClick={() => setMobileOpen(false)}>Researchers & Publications</Link>
          <Link href="/projects" className={styles.mobileNavLink} style={{ marginLeft: '1rem' }} onClick={() => setMobileOpen(false)}>Projects</Link>
          <Link href="/achievements" className={styles.mobileNavLink} style={{ marginLeft: '1rem' }} onClick={() => setMobileOpen(false)}>Achievements</Link>
          <div style={{ padding: '0.5rem', fontWeight: 'bold' }}>Services</div>
          <Link href="/services" className={styles.mobileNavLink} style={{ marginLeft: '1rem' }} onClick={() => setMobileOpen(false)}>Our Services</Link>
          <Link href="/services/collaborate" className={styles.mobileNavLink} style={{ marginLeft: '1rem' }} onClick={() => setMobileOpen(false)}>Collaborate With Us</Link>
          <Link href="/internships" className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>Internships & Training</Link>
          <Link href="/student-resources" className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>Student Resource Hub</Link>
        </div>
      )}
    </nav>
  );
}