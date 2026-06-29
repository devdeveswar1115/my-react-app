"use client";

import { useState } from 'react';
import { GraduationCap, Award, Microscope, Search, Globe, Link as LinkIcon, Users, DollarSign, Clock, Briefcase, ArrowLeft } from "lucide-react";
import styles from "./page.module.css";
import { studentResourcesData } from "@/data/studentResources";

export default function StudentResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrg, setExpandedOrg] = useState<string | null>(null);

  const filteredData = studentResourcesData.filter(item => 
    item.Organization.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.Areas.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const importantLinks = [
    { name: "Department of Science & Technology", short: "DST", url: "https://dst.gov.in/", logo: "/Official_India_Science_Logos/DST_Logo.png" },
    { name: "SERB PRISM", short: "SERB", url: "https://serbonline.in/SERB/prism", logo: "/Official_India_Science_Logos/SERB_PRISM_Logo.jpg" },
    { name: "Council of Scientific & Industrial Research", short: "CSIR", url: "https://www.csir.res.in/", logo: "/Official_India_Science_Logos/CSIR_Logo.png" },
    { name: "INSERB India", short: "INSERB", url: "https://serbonline.in/SERB/HomePage", logo: "/Official_India_Science_Logos/INSERB_India_Logo.jpg" },
    { name: "Department of Biotechnology", short: "DBT", url: "https://dbtindia.gov.in/", logo: "/Official_India_Science_Logos/DBT_Logo.jpg" }
  ];

  // Duplicated for seamless infinite scrolling
  const duplicatedLinks = [...importantLinks, ...importantLinks, ...importantLinks];



  const expandedResource = expandedOrg ? studentResourcesData.find(r => r.Organization === expandedOrg) : null;

  return (
    <div className="section container">
      <h1 className="section-title">Student Resource Hub</h1>
      <p className="section-subtitle">
        Explore a curated list of project grants, fellowships, and fund providers to support your academic and research journey.
      </p>

      {expandedResource ? (
        <div style={{ marginTop: '2rem' }}>
          <button 
            onClick={() => setExpandedOrg(null)}
            className="btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', background: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border)', cursor: 'pointer' }}
          >
            <ArrowLeft size={16} /> Go back to resource list
          </button>
          
          <div className={styles.resourceCard} style={{ cursor: 'default', maxWidth: '900px', margin: '0 auto', gridColumn: '1 / -1' }}>
            <div className={styles.cardHeader}>
                <div className={`${styles.orgIconWrapper} ${styles.orgIconWrapperLarge}`}>
                  {expandedResource.Logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={expandedResource.Logo} alt={`${expandedResource.Organization} Logo`} className={styles.orgLogoImage} />
                  ) : (
                    expandedResource.Organization.charAt(0)
                  )}
                </div>
                <div className={styles.headerText}>
                  <h2 className={styles.orgName} style={{ fontSize: '2rem' }}>{expandedResource.Organization}</h2>
                  <p className={styles.orgDesc} style={{ fontSize: '1.1rem' }}>{expandedResource.Description}</p>
                </div>
            </div>
            
            <div className={styles.cardTags} style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
              {expandedResource.Areas.split(',').map((area, i) => (
                <span key={i} className={styles.tag}>{area.trim()}</span>
              ))}
            </div>

            <div className={styles.detailGrid} style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
              <div className={styles.detailItem}>
                <Briefcase className={styles.detailIcon} size={20} />
                <div>
                  <strong>Support Provided</strong>
                  <p>{expandedResource.Support}</p>
                </div>
              </div>
              <div className={styles.detailItem}>
                <Users className={styles.detailIcon} size={20} />
                <div>
                  <strong>Eligibility</strong>
                  <p>{expandedResource.Eligibility}</p>
                </div>
              </div>
              <div className={styles.detailItem}>
                <Award className={styles.detailIcon} size={20} />
                <div>
                  <strong>Age Criteria</strong>
                  <p>{expandedResource.Age}</p>
                </div>
              </div>
              <div className={styles.detailItem}>
                <DollarSign className={styles.detailIcon} size={20} />
                <div>
                  <strong>Funding / Benefits</strong>
                  <p>{expandedResource.Funding}</p>
                </div>
              </div>
              <div className={styles.detailItem}>
                <Clock className={styles.detailIcon} size={20} />
                <div>
                  <strong>Notification Frequency</strong>
                  <p>{expandedResource.Frequency}</p>
                </div>
              </div>
              <div className={styles.detailItem}>
                <GraduationCap className={styles.detailIcon} size={20} />
                <div>
                  <strong>Selection Process</strong>
                  <p>{expandedResource.Selection}</p>
                </div>
              </div>
            </div>

            <div className={styles.cardActions} style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', marginTop: '2rem' }}>
              <div className={styles.linkActions}>
                <a href={expandedResource.NotificationUrl} target="_blank" rel="noopener noreferrer" className={styles.actionLink}>
                  <LinkIcon size={16} /> Official Notification
                </a>
                <a href={expandedResource.Website} target="_blank" rel="noopener noreferrer" className={styles.actionLinkPrimary}>
                  <Globe size={16} /> Official Website
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.searchContainer}>
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} size={20} />
              <input 
                type="text" 
                placeholder="Search resources, organizations, or preferred areas..." 
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.cardsGrid}>
            {filteredData.map((row, idx) => (
              <div key={idx} className={styles.resourceCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.orgIconWrapper}>
                    {row.Logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={row.Logo} alt={`${row.Organization} Logo`} className={styles.orgLogoImage} />
                    ) : (
                      row.Organization.charAt(0)
                    )}
                  </div>
                  <div className={styles.headerText}>
                    <h2 className={styles.orgName}>{row.Organization}</h2>
                    <p className={styles.orgDesc}>{row.Description}</p>
                  </div>
                </div>
                
                <div className={styles.cardTags}>
                  {row.Areas.split(',').slice(0, 3).map((area, i) => (
                    <span key={i} className={styles.tag}>{area.trim()}</span>
                  ))}
                  {row.Areas.split(',').length > 3 && (
                    <span className={styles.tag}>+{row.Areas.split(',').length - 3}</span>
                  )}
                </div>

                <div className={styles.cardActions}>
                  <button 
                    className={styles.expandBtn} 
                    onClick={() => setExpandedOrg(row.Organization)}
                  >
                    View Details
                  </button>
                  
                  <div className={styles.linkActions}>
                    <a href={row.Website} target="_blank" rel="noopener noreferrer" className={styles.actionLinkPrimary}>
                      <Globe size={14} /> Website
                    </a>
                  </div>
                </div>
              </div>
            ))}
            {filteredData.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <Microscope size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <h3>No resources found matching your search.</h3>
              </div>
            )}
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
        </>
      )}
    </div>
  );
}
