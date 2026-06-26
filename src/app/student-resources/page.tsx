"use client";

import { GraduationCap, Award, Building, Microscope } from "lucide-react";
import styles from "./page.module.css";

export default function StudentResourcesPage() {
  const importantLinks = [
    { name: "Department of Science & Technology", short: "DST", url: "https://dst.gov.in/", logo: "/Official_India_Science_Logos/DST_Logo.png" },
    { name: "SERB PRISM", short: "SERB", url: "https://serbonline.in/SERB/prism", logo: "/Official_India_Science_Logos/SERB_PRISM_Logo.jpg" },
    { name: "Council of Scientific & Industrial Research", short: "CSIR", url: "https://www.csir.res.in/", logo: "/Official_India_Science_Logos/CSIR_Logo.png" },
    { name: "INSERB India", short: "INSERB", url: "https://serbonline.in/SERB/HomePage", logo: "/Official_India_Science_Logos/INSERB_India_Logo.jpg" },
    { name: "Department of Biotechnology", short: "DBT", url: "https://dbtindia.gov.in/", logo: "/Official_India_Science_Logos/DBT_Logo.jpg" }
  ];

  // Duplicated for seamless infinite scrolling
  const duplicatedLinks = [...importantLinks, ...importantLinks, ...importantLinks];

  const grants = [
    {
      title: "ANRF (Formerly SERB)",
      overview: "ANRF (Formerly SERB) is a major funding opportunity supporting research and academic development.",
      support: "Research grants, startup grants, international collaboration, equipment support",
      eligibility: "Faculty, scientists, researchers in recognized institutions",
      age: "No fixed age limit (scheme specific)",
      funding: "₹30 Lakhs to multi-crore projects",
      preferred: "Drug delivery, life sciences, pharmacy, biotechnology",
      selection: "Apply online, peer review, expert evaluation",
      website: "https://www.anrf.gov.in",
      icon: <Building size={32} />
    },
    {
      title: "DBT-JRF",
      overview: "DBT-JRF is a major funding opportunity supporting research and academic development.",
      support: "PhD fellowship, contingency, research training",
      eligibility: "M.Pharm, M.Sc., Biotechnology graduates",
      age: "Usually ≤28 years with relaxation",
      funding: "Govt JRF/SRF rates",
      preferred: "Biotechnology, molecular biology, cancer research",
      selection: "BET examination + merit",
      website: "https://www.dbtjrf.gov.in",
      icon: <GraduationCap size={32} />
    }
  ];

  return (
    <div className="section container">
      <h1 className="section-title">Student Resource Hub</h1>
      <p className="section-subtitle">
        Explore a curated list of project grants, fellowships, and fund providers to support your academic and research journey.
      </p>



      <div style={{ display: 'grid', gap: '2rem', marginTop: '3rem' }}>
        {grants.map((grant, idx) => (
          <div key={idx} style={{ 
            backgroundColor: 'var(--surface)', 
            padding: '2rem', 
            borderRadius: 'var(--radius)', 
            border: '1px solid var(--border)',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
              {grant.icon}
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{grant.title}</h2>
            </div>
            
            <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-main)' }}>
              <strong>Overview:</strong> {grant.overview}
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div><strong>Support Provided:</strong> {grant.support}</div>
              <div><strong>Eligibility:</strong> {grant.eligibility}</div>
              <div><strong>Age Criteria:</strong> {grant.age}</div>
              <div><strong>Funding/Benefits:</strong> {grant.funding}</div>
              <div><strong>Preferred Areas:</strong> {grant.preferred}</div>
              <div><strong>Selection Process:</strong> {grant.selection}</div>
            </div>
            
            <div style={{ marginTop: '1rem' }}>
              <a href={grant.website} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                Visit Official Website <Award size={18} />
              </a>
            </div>
          </div>
        ))}

        <div style={{ textAlign: 'center', marginTop: '2rem', padding: '2rem', backgroundColor: 'var(--bg-alt)', borderRadius: 'var(--radius)' }}>
          <Microscope size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', display: 'inline-block' }} />
          <h3>And Many More Opportunities...</h3>
          <p>We constantly update our resources hub. Keep an eye out for new fellowships and grants.</p>
        </div>
      </div>

      {/* Important Links moved to bottom */}
      <div style={{ marginTop: '4rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--primary)', marginBottom: '1.5rem', textAlign: 'center' }}>
          Important Links
        </h2>
        <div className={styles.marqueeWrapper}>
          <div className={styles.marqueeTrack}>
            {duplicatedLinks.map((link, idx) => (
              <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className={styles.linkCard}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={link.logo} 
                  alt={`${link.short} Logo`} 
                  className={styles.logoPlaceholder} 
                />
                <span className={styles.linkName}>{link.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
