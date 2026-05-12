"use client";

import { useState } from "react";
import { Mail, Search, ExternalLink, GraduationCap, FlaskConical, Microscope, User } from "lucide-react";
import { researchersList } from "@/data/lab";
import { publicationsList } from "@/data/publications";
import styles from "./page.module.css";

export default function ResearchPage() {
  const [pubSearch, setPubSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Founder");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const filteredPublications = publicationsList.filter((pub) =>
    pub.authors.some((author) => author.toLowerCase().includes(pubSearch.toLowerCase())) ||
    pub.title.toLowerCase().includes(pubSearch.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPublications.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPublications = filteredPublications.slice(indexOfFirstItem, indexOfLastItem);

  const tabs = [
    { id: "Founder", label: "Founder", icon: <User size={18} /> },
    { id: "Faculty", label: "Faculty", icon: <User size={18} /> },
    { id: "Phd Scholarsh", label: "Phd Scholarsh", icon: <GraduationCap size={18} /> },
    { id: "Mpharm", label: "Mpharm", icon: <FlaskConical size={18} /> }
  ];

  const activeResearchers = researchersList.filter(r => r.category === activeTab);

  return (
    <div className="section container">
      <h1 className="section-title">Researchers & Publications</h1>
      <p className="section-subtitle">
        Meet our team of dedicated scientists and explore their latest contributions to the field.
      </p>

      <div className={styles.splitLayout}>
        {/* Section A: Researchers */}
        <section>
          <div className={styles.sectionHeader}>
            <h2>Our Team</h2>
          </div>
          
          <div className={styles.tabsContainer}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ""}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {activeResearchers.length > 0 ? (
            <div className={styles.researchersGrid} key={activeTab}>
              {activeResearchers.map((researcher) => (
                <div key={researcher.id} className={`card ${styles.researcherCard}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={researcher.image} 
                    alt={researcher.name} 
                    className={styles.researcherImage} 
                    style={{ objectPosition: (researcher as any).imagePosition || 'top center' }} 
                  />
                  <h4 className={styles.researcherName}>{researcher.name}</h4>
                  {researcher.qualification && (
                    <div className={styles.researcherRole} style={{ marginBottom: "0.25rem", color: "var(--text-main)" }}>
                      <strong>Qualification:</strong> {researcher.qualification}
                    </div>
                  )}
                  <div className={styles.researcherRole}>{researcher.role}</div>
                  <div className={styles.researchArea}>
                    <strong>Focus:</strong> {researcher.researchArea}
                  </div>
                  {researcher.email && (
                    <a href={`mailto:${researcher.email}`} className={styles.contactLink}>
                      <Mail size={16} /> Contact
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              No members found in this category.
            </div>
          )}
        </section>

        {/* Section B: Publications */}
        <section>
          <div className={styles.sectionHeader}>
            <h2>Publications Archive</h2>
          </div>
          
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="Search by author name or title..."
              className={`form-input ${styles.searchInput}`}
              value={pubSearch}
              onChange={(e) => {
                setPubSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className={styles.publicationsList}>
            {currentPublications.length > 0 ? (
              currentPublications.map((pub) => (
                <div key={pub.id} className={styles.pubCard}>
                  <h3 className={styles.pubTitle}>{pub.title}</h3>
                  <div className={styles.pubAuthors}>{pub.authors.join(", ")}</div>
                  <div className={styles.pubMeta}>
                    <span className={styles.pubJournal}>{pub.journal}</span>
                    <span>•</span>
                    <span>{pub.year}</span>
                  </div>
                  <a href={pub.link} className={styles.pubLink} target="_blank" rel="noopener noreferrer">
                    Read Paper <ExternalLink size={14} />
                  </a>
                </div>
              ))
            ) : (
              <div className={styles.noResults}>
                No publications found matching "{pubSearch}".
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={styles.pageBtn}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={styles.pageBtn}
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
