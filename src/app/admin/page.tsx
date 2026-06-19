"use client";

import styles from './admin.module.css';
import { useEffect, useState } from 'react';
import { getDocuments } from '../../services/firebaseCrud';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    faculty: 0,
    students: 0,
    publications: 0,
    projects: 0,
    events: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [fac, stu, pub, proj, ev] = await Promise.all([
          getDocuments('faculty'),
          getDocuments('phd_students'),
          getDocuments('publications'),
          getDocuments('projects'),
          getDocuments('events')
        ]);
        setStats({
          faculty: fac.length,
          students: stu.length,
          publications: pub.length,
          projects: proj.length,
          events: ev.length
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Dashboard Overview</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div className={styles.card} style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#475569', marginBottom: '0.5rem' }}>Faculty</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.faculty}</div>
        </div>
        <div className={styles.card} style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#475569', marginBottom: '0.5rem' }}>PhD Students</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.students}</div>
        </div>
        <div className={styles.card} style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#475569', marginBottom: '0.5rem' }}>Publications</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.publications}</div>
        </div>
        <div className={styles.card} style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#475569', marginBottom: '0.5rem' }}>Projects</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.projects}</div>
        </div>
        <div className={styles.card} style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#475569', marginBottom: '0.5rem' }}>Events</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.events}</div>
        </div>
      </div>
    </div>
  );
}
