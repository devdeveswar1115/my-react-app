"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Calendar, Trophy, ArrowLeft } from "lucide-react";
import { getDocuments } from "@/services/firebaseCrud";

export default function AchievementsPage() {
  const [achievementsList, setAchievementsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getDocuments('achievements');
      const sortedData = data.sort((a: any, b: any) => {
         const dateA = new Date(a.date || 0).getTime();
         const dateB = new Date(b.date || 0).getTime();
         return dateB - dateA;
      });
      setAchievementsList(sortedData);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="section container">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Trophy className="text-primary" size={32} /> Our Achievements
        </h1>
        <p className="section-subtitle">
          Discover the milestones, awards, and recognitions earned by our dedicated team.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading achievements...</div>
      ) : expandedId ? (
        <div style={{ margin: '0 auto', maxWidth: '800px' }}>
          {achievementsList.filter(a => a.id === expandedId).map((item) => (
            <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                <Calendar size={14} />
                <span>{item.date ? new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Date not specified'}</span>
              </div>
              
              <h2 style={{ fontSize: '2rem', color: 'var(--primary)', lineHeight: 1.3, fontWeight: 'bold', marginBottom: '1.5rem' }}>
                {item.title}
              </h2>
              
              {item.image && (
                <div style={{ marginBottom: '2rem', overflow: 'hidden', borderRadius: '8px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.title} style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', backgroundColor: '#000' }} />
                </div>
              )}
              
              <p style={{ color: 'var(--text-main)', fontSize: '1.05rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                {item.body}
              </p>
              
              {item.linkUrl && (
                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                  <a 
                    href={item.linkUrl.startsWith('http') ? item.linkUrl : `https://${item.linkUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      color: 'var(--primary)', 
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'opacity 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
                    onMouseOut={e => e.currentTarget.style.opacity = '1'}
                  >
                    {item.linkText || 'View Document'} <ExternalLink size={16} />
                  </a>
                </div>
              )}
              
              <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-start' }}>
                <button 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'var(--bg-alt)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                  onClick={() => setExpandedId(null)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--border-color)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-alt)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <ArrowLeft size={18} /> Go back to achievements list
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
          {achievementsList.map((item) => (
            <div 
              key={item.id} 
              className="card" 
              style={{ display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer', transition: 'all 0.3s' }}
              onClick={() => setExpandedId(item.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                <Calendar size={14} />
                <span>{item.date ? new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Date not specified'}</span>
              </div>
              
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', lineHeight: 1.4, fontWeight: 'bold', margin: 0 }}>
                {item.title}
              </h3>
            </div>
          ))}
          {achievementsList.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', backgroundColor: 'var(--bg-alt)', borderRadius: '8px' }}>
              <Trophy size={48} style={{ color: 'var(--border-color)', margin: '0 auto 1rem' }} />
              <p style={{ color: 'var(--text-muted)' }}>No achievements have been posted yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
