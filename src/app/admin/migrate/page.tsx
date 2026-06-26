"use client";

import { useState } from 'react';
import { labData, researchersList, equipmentList, servicesList } from '../../../data/lab';
import { projectsList } from '../../../data/projects';
import { publicationsList } from '../../../data/publications';
import { addDocument, getDocuments } from '../../../services/firebaseCrud';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import styles from '../admin.module.css';

export default function MigratePage() {
  const [log, setLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ success: 0, skipped: 0, failed: 0 });

  const addLog = (msg: string) => {
    setLog(prev => [...prev, msg]);
  };

  const documentExists = async (collectionName: string, field: string, value: string) => {
    try {
      const q = query(collection(db, collectionName), where(field, "==", value));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (e) {
      console.error("Error checking existence:", e);
      return false; // Assume it doesn't exist if query fails, or handle differently
    }
  };

  const checkCollectionsEmpty = async () => {
    try {
      const fac = await getDocuments('faculty');
      const stu = await getDocuments('phd_students');
      return fac.length === 0 && stu.length === 0;
    } catch (e) {
      return true; // if error, assume we can proceed and let individual checks handle it
    }
  };

  const uploadAndGetUrl = async (localPath: string, folder: string) => {
    if (!localPath || localPath.startsWith('http')) return localPath; // Already external url or empty
    if (localPath.startsWith('data:image')) return localPath; // Already base64
    
    const res = await fetch(localPath);
    if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
    const blob = await res.blob();
    
    if (blob.size > 900 * 1024) {
      throw new Error(`Image too large for Firestore (>900KB)`);
    }

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleMigrate = async () => {
    if (!confirm("Are you sure? This will process all local data. Ensure your Firebase Storage rules allow writes.")) return;
    
    setLoading(true);
    setLog(['Starting migration checks...']);
    setStats({ success: 0, skipped: 0, failed: 0 });
    let s = 0; let sk = 0; let f = 0;

    try {
      const isEmpty = await checkCollectionsEmpty();
      if (!isEmpty) {
        addLog("Warning: Collections already have data. Proceeding in 'Skip Duplicate' mode...");
      }

      // 1. Migrate Faculty & Students
      for (const r of researchersList) {
        addLog(`Processing researcher: ${r.name}`);
        try {
          let colName = 'faculty';
          if (r.category === 'Phd Scholarsh' || r.role.toLowerCase().includes('ph.d')) {
            colName = 'phd_students';
          } else if (r.category === 'Mpharm') {
            colName = r.role.toLowerCase().includes('technician') ? 'lab_technicians' : 'mpharm_students';
          }
          
          if (await documentExists(colName, 'name', r.name)) {
            addLog(`⏭️ Skipped (already exists): ${r.name}`);
            sk++;
            continue;
          }

          let imageUrl = '';
          try {
            imageUrl = await uploadAndGetUrl(r.image, 'faculty_students');
          } catch (imgErr: any) {
            addLog(`⚠️ Image upload failed for ${r.name} (${imgErr.message}). Skipping document to prevent orphaned data.`);
            f++;
            continue; // Skip document insertion
          }

          if (colName === 'phd_students') {
            await addDocument('phd_students', {
              name: r.name,
              topic: r.researchArea,
              year: '',
              email: r.email || '',
              image: imageUrl
            });
          } else if (colName === 'lab_technicians') {
            await addDocument('lab_technicians', {
              name: r.name,
              role: r.role,
              email: r.email || '',
              image: imageUrl,
              researchArea: r.researchArea || ''
            });
          } else if (colName === 'mpharm_students') {
            await addDocument('mpharm_students', {
              name: r.name,
              role: r.role,
              email: r.email || '',
              image: imageUrl,
              researchArea: r.researchArea || '',
              year: ''
            });
          } else {
            await addDocument('faculty', {
              name: r.name,
              designation: r.role,
              email: r.email || '',
              image: imageUrl,
              researchAreas: r.researchArea,
              bio: ''
            });
          }
          addLog(`✅ Successfully migrated: ${r.name}`);
          s++;
        } catch (e: any) {
          addLog(`❌ Failed to migrate ${r.name}: ${e.message}`);
          f++;
        }
      }

      // 2. Migrate Founders (adding to faculty)
      for (const fnd of labData.founders) {
        addLog(`Processing founder: ${fnd.name}`);
        try {
          if (await documentExists('faculty', 'name', fnd.name)) {
            addLog(`⏭️ Skipped (already exists): ${fnd.name}`);
            sk++;
            continue;
          }

          let imageUrl = '';
          try {
            imageUrl = await uploadAndGetUrl(fnd.image, 'faculty_students');
          } catch (imgErr: any) {
            addLog(`⚠️ Image upload failed for ${fnd.name}. Skipping document.`);
            f++;
            continue;
          }

          await addDocument('faculty', {
            name: fnd.name,
            designation: fnd.designation,
            email: '',
            image: imageUrl,
            researchAreas: '',
            bio: fnd.bio
          });
          addLog(`✅ Successfully migrated founder: ${fnd.name}`);
          s++;
        } catch (e: any) {
          addLog(`❌ Failed to migrate ${fnd.name}: ${e.message}`);
          f++;
        }
      }

      // 3. Migrate Projects
      for (const p of projectsList) {
        addLog(`Processing project: ${p.title}`);
        try {
          if (await documentExists('projects', 'title', p.title)) {
            addLog(`⏭️ Skipped (already exists): ${p.title}`);
            sk++;
            continue;
          }

          await addDocument('projects', {
            title: p.title,
            description: p.description,
            status: p.status,
            image: '',
            facultyLead: p.lead,
            fundingAgency: p.description
          });
          addLog(`✅ Successfully migrated project: ${p.title}`);
          s++;
        } catch (e: any) {
          addLog(`❌ Failed to migrate project ${p.title}: ${e.message}`);
          f++;
        }
      }

      // 4. Migrate Publications
      for (const p of publicationsList) {
        addLog(`Processing publication: ${p.title}`);
        try {
          if (await documentExists('publications', 'title', p.title)) {
            addLog(`⏭️ Skipped (already exists): ${p.title}`);
            sk++;
            continue;
          }

          await addDocument('publications', {
            title: p.title,
            authors: p.authors,
            journal: p.journal,
            year: p.year,
            abstract: '',
            image: '',
            pdfLink: (p as any).link || '',
            doi: (p as any).doi || ''
          });
          addLog(`✅ Successfully migrated publication: ${p.title}`);
          s++;
        } catch (e: any) {
          addLog(`❌ Failed to migrate publication ${p.title}: ${e.message}`);
          f++;
        }
      }

      // 5. Migrate Equipment
      for (const eq of equipmentList) {
        addLog(`Processing equipment: ${eq.name}`);
        try {
          if (await documentExists('equipment', 'name', eq.name)) {
            addLog(`⏭️ Skipped (already exists): ${eq.name}`);
            sk++;
            continue;
          }

          let imageUrl = '';
          try {
            imageUrl = await uploadAndGetUrl(eq.image, 'equipment');
          } catch (imgErr: any) {
            addLog(`⚠️ Image convert failed for ${eq.name}. Skipping document.`);
            f++;
            continue;
          }

          await addDocument('equipment', {
            name: eq.name,
            category: eq.category,
            description: eq.description,
            specs: eq.specs,
            image: imageUrl
          });
          addLog(`✅ Successfully migrated equipment: ${eq.name}`);
          s++;
        } catch (e: any) {
          addLog(`❌ Failed to migrate equipment ${eq.name}: ${e.message}`);
          f++;
        }
      }

      // 6. Migrate Services
      for (const srv of servicesList) {
        addLog(`Processing service: ${srv.instrument} - ${srv.serviceType}`);
        try {
          if (await documentExists('services', 'instrument', srv.instrument) && 
              await documentExists('services', 'serviceType', srv.serviceType)) {
            addLog(`⏭️ Skipped (already exists): ${srv.instrument} - ${srv.serviceType}`);
            sk++;
            continue;
          }

          await addDocument('services', {
            instrument: srv.instrument,
            serviceType: srv.serviceType,
            soa: srv.soa,
            university: srv.university,
            national: srv.national,
            industry: srv.industry
          });
          addLog(`✅ Successfully migrated service: ${srv.instrument}`);
          s++;
        } catch (e: any) {
          addLog(`❌ Failed to migrate service ${srv.instrument}: ${e.message}`);
          f++;
        }
      }

      addLog(`🎉 Migration completed!`);
      setStats({ success: s, skipped: sk, failed: f });
    } catch (globalErr: any) {
      addLog(`🚨 Critical Migration Error: ${globalErr.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h2>Robust Data Migration</h2>
      <p style={{ marginBottom: '1rem', color: '#475569' }}>
        This script checks for duplicates, safely converts images from the /public folder to Base64 text, and inserts documents directly into Firestore without needing Firebase Storage.
      </p>
      
      <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fffbeb', borderLeft: '4px solid #f59e0b', color: '#b45309' }}>
        <strong>IMPORTANT:</strong> If you get a permission error, ensure your Firestore rules allow writes.
      </div>

      <button 
        onClick={handleMigrate} 
        className={styles.btnPrimary} 
        disabled={loading}
      >
        {loading ? 'Migrating...' : 'Start Secure Migration'}
      </button>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem' }}>
        <div style={{ color: '#10b981', fontWeight: 'bold' }}>Success: {stats.success}</div>
        <div style={{ color: '#64748b', fontWeight: 'bold' }}>Skipped: {stats.skipped}</div>
        <div style={{ color: '#ef4444', fontWeight: 'bold' }}>Failed: {stats.failed}</div>
      </div>

      <div style={{ marginTop: '1.5rem', background: '#1e293b', color: '#10b981', padding: '1rem', borderRadius: '4px', height: '400px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.875rem' }}>
        {log.map((l, i) => (
          <div key={i} style={{ marginBottom: '4px', color: l.includes('❌') || l.includes('⚠️') || l.includes('🚨') ? '#f87171' : l.includes('⏭️') ? '#94a3b8' : '#34d399' }}>
            {l}
          </div>
        ))}
        {log.length === 0 && <span style={{ color: '#64748b' }}>Waiting for action...</span>}
      </div>
    </div>
  );
}
