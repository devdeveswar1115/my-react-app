"use client";

import { usePathname } from 'next/navigation';
import ProtectedRoute from './ProtectedRoute';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useRouter } from 'next/navigation';
import { Users, GraduationCap, BookOpen, Briefcase, Calendar, Database, LogOut, Menu, X, LayoutDashboard, Microscope, Trophy } from 'lucide-react';
import styles from '../app/admin/admin.module.css';

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Founders', href: '/admin/founders', icon: Users },
    { label: 'Leaders Voice', href: '/admin/leaders', icon: Users },
    { label: 'Faculty', href: '/admin/faculty', icon: Users },
    { label: 'Students', href: '/admin/students', icon: GraduationCap },
    { label: 'Lab Technicians', href: '/admin/technicians', icon: Users },
    { href: '/admin/publications', label: 'Publications', icon: BookOpen },
    { href: '/admin/projects', label: 'Projects', icon: Briefcase },
    { href: '/admin/patents', label: 'Patents', icon: Briefcase },
    { href: '/admin/mou', label: 'MOUs', icon: Briefcase },
    { href: '/admin/collaborations', label: 'Collaborations', icon: Users },
    { href: '/admin/events', label: 'Events', icon: Calendar },
    { href: '/admin/news', label: 'News & Notices', icon: Calendar },
    { href: '/admin/achievements', label: 'Achievements', icon: Trophy },
    { href: '/admin/equipment', label: 'Equipment', icon: Microscope },
    { href: '/admin/services', label: 'Services', icon: Database },
    { href: '/admin/migrate', label: 'Migration Tool', icon: Database },
  ];

  return (
    <ProtectedRoute>
      <div className={styles.adminContainer}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2>Admin Panel</h2>
          </div>
          <nav className={styles.sidebarNav}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className={styles.sidebarFooter}>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              <LogOut size={20} />
              <span>Logout</span>
            </button>
            <Link href="/" className={styles.backHomeBtn}>
              Back to Site
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          <div className={styles.topbar}>
            <h1>H-N Laboratory CMS</h1>
          </div>
          <div className={styles.content}>
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
