"use client";

import { useEffect, useState } from "react";
import { User, Calendar, ExternalLink } from "lucide-react";
import { getDocuments } from "@/services/firebaseCrud";
import styles from "./page.module.css";

export default function ProjectsPage() {
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [patentsList, setPatentsList] = useState<any[]>([]);
  const [mouList, setMouList] = useState<any[]>([]);
  const [collaborationsList, setCollaborationsList] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('projects');

  useEffect(() => {
    const fetchData = async () => {
      const proj = await getDocuments('projects');
      setProjectsList(proj);
      
      const pat = await getDocuments('patents');
      setPatentsList(pat);
      
      const mou = await getDocuments('mou');
      setMouList(mou);
      
      const col = await getDocuments('collaborations');
      setCollaborationsList(col);
    };
    fetchData();
  }, []);
  const sortedProjects = [...projectsList].sort((a, b) => {
    if (a.status === 'ongoing' && b.status !== 'ongoing') return -1;
    if (a.status !== 'ongoing' && b.status === 'ongoing') return 1;
    return 0;
  });

  return (
    <div className="section container">
      <h1 className="section-title">Research Projects</h1>
      <p className="section-subtitle">
        Explore our active and completed research initiatives shaping the future of materials science.
      </p>

      <div className={styles.tabsContainer}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'projects' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Research Projects
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'patents' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('patents')}
        >
          Patents & MOU
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'collaborations' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('collaborations')}
        >
          Collaborations
        </button>
      </div>

      {activeTab === 'projects' && (
        <div className={styles.timelineContainer}>
          {sortedProjects.map((project) => (
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.cardInner}>
                <div className={styles.cardContent}>
                  <div className={styles.projectHeader}>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    <span className={`${styles.statusBadge} ${styles[`status-${project.status}`]}`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <p className={styles.projectDesc}>{project.description}</p>
                  
                  <div className={styles.projectMeta}>
                    <div className={styles.metaItem}>
                      <User size={14} />
                      <span>Lead: {project.facultyLead || project.lead}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <Calendar size={14} />
                      <span>{project.fundingAgency || project.timeline || 'Ongoing'}</span>
                    </div>
                  </div>
                  
                  {project.linkUrl && (
                    <div style={{ marginTop: '1rem' }}>
                      <a 
                        href={project.linkUrl.startsWith('http') ? project.linkUrl : `https://${project.linkUrl}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}
                      >
                        More Information <ExternalLink size={14} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'patents' && (
        <div className={styles.listsContainer}>
          <div className={styles.listSection}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Patents & Tech Transfer</h2>
            {patentsList.length > 0 ? (
              <ul className={styles.customList}>
                {patentsList.map(item => (
                  <li key={item.id}>
                    <strong>{item.title}</strong>
                    {item.details && <p>{item.details}</p>}
                    {item.linkUrl && (
                      <a 
                        href={item.linkUrl.startsWith('http') ? item.linkUrl : `https://${item.linkUrl}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginTop: '0.5rem' }}
                      >
                        Read More <ExternalLink size={14} />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No patents or tech transfers listed yet.</p>
            )}
          </div>
          
          <div className={styles.listSection} style={{ marginTop: '3rem' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Memorandums of Understanding (MOU)</h2>
            {mouList.length > 0 ? (
              <ul className={styles.customList}>
                {mouList.map(item => (
                  <li key={item.id} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {item.logo && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={item.logo} alt={item.partner} style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '8px', backgroundColor: 'white', padding: '0.5rem' }} />
                    )}
                    <div>
                      <strong>{item.partner}</strong>
                      {item.description && <p>{item.description}</p>}
                      {item.linkUrl && (
                        <a 
                          href={item.linkUrl.startsWith('http') ? item.linkUrl : `https://${item.linkUrl}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginTop: '0.5rem' }}
                        >
                          More Information <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No MOUs listed yet.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'collaborations' && (
        <div className={styles.listsContainer}>
          <div className={styles.listSection}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Research Collaborations</h2>
            {collaborationsList.length > 0 ? (
              <div className="grid grid-2">
                {collaborationsList.map(item => (
                  <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    {item.logo && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={item.logo} alt={item.institution} style={{ width: '100%', height: '120px', objectFit: 'contain', marginBottom: '1rem', backgroundColor: 'white', borderRadius: '4px', padding: '0.5rem' }} />
                    )}
                    <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>{item.institution}</h3>
                    {item.investigator && <p style={{ fontSize: '0.9rem' }}><strong>Investigator:</strong> {item.investigator}</p>}
                    {item.project && <p style={{ fontSize: '0.9rem' }}><strong>Project:</strong> {item.project}</p>}
                    {item.linkUrl && (
                      <a 
                        href={item.linkUrl.startsWith('http') ? item.linkUrl : `https://${item.linkUrl}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginTop: '1rem' }}
                      >
                        More Information <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No collaborations listed yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
