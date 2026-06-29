"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Microscope } from "lucide-react";
import { labData } from "@/data/lab";
import { publicationsList } from "@/data/publications";
import { newsData } from "@/data/news";
import styles from "./page.module.css";
import EventsSlider from "@/components/EventsSlider";
import LeadersSlider from "@/components/LeadersSlider";
import AnimatedCounter from "@/components/AnimatedCounter";
import { getDocuments } from "@/services/firebaseCrud";

export default function Home() {
  const { about, funding, gallery } = labData;
  const publicationsCount = publicationsList.length;
  const [newsList, setNewsList] = useState<any[]>([]);

  useEffect(() => {
    // Fetch News dynamically
    const fetchNews = async () => {
      const data = await getDocuments('news');
      // If no data yet in firebase, fallback to mock data
      if (data.length === 0) {
        setNewsList(newsData);
      } else {
        setNewsList(data);
      }
    };
    fetchNews();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContent}`} style={{ position: 'relative', zIndex: 10 }}>
          <Microscope size={64} style={{ display: 'block', margin: '0 auto 1.5rem' }} />
          <h1 className={styles.heroTitle}>{about.title}</h1>
          <p className={styles.heroDesc}>{about.description}</p>
          <div className={styles.heroActions}>
            <Link href="/research" className={`btn ${styles.btnWhite}`}>
              Explore Research <ArrowRight size={18} />
            </Link>
            <Link href="/services" className={`btn ${styles.btnOutlineWhite}`}>
              Testing Services
            </Link>
            <Link href="/internships" className={`btn ${styles.btnOutlineWhite}`}>
              Internship Program
            </Link>
          </div>
          
        </div>
      </section>




      {/* Testing Services Highlight Section */}
      <section className="section">
        <div className="container" style={{ textAlign: "center" }}>
          <h2 className="section-title">Testing & Analysis Services</h2>
          <p className="section-subtitle">
            We provide state-of-the-art analytical equipment and testing services for academic and industrial research.
          </p>
          <div style={{ marginTop: '2rem' }}>
            <Link href="/services" className={`btn btn-primary`}>
              View All Services & Request Testing
            </Link>
          </div>
        </div>
      </section>

      {/* Events & News Section (Split Layout) */}
      <section className="section" style={{ backgroundColor: 'var(--bg-alt)' }}>
        <div className="container">
          <div className={styles.homeSplitLayout}>
            {/* Events & Highlights (Left) */}
            <div className={styles.homeSplitLeft}>
              <h2 className="section-title" style={{ textAlign: "center", color: 'var(--text-main)' }}>Events & Highlights</h2>
              <p className="section-subtitle" style={{ textAlign: "center", marginBottom: '2rem', color: 'var(--text-muted)' }}>Catch up on our latest workshops, seminars, and lab activities.</p>
              <EventsSlider />
            </div>

            {/* News & Notices Box (Right) */}
            <div className={styles.homeSplitRight}>
              <div className={styles.newsContainer}>
                <div className={styles.newsHeader}>
                  <div className={styles.newsIconWrapper}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
                      <path d="M18 14h-8"></path>
                      <path d="M15 18h-5"></path>
                      <path d="M10 6h8v4h-8V6Z"></path>
                    </svg>
                  </div>
                  <h2 className="section-title" style={{ margin: 0, textAlign: 'left', fontSize: '2rem' }}>News</h2>
                  <div className={styles.newsHeaderLine}></div>
                </div>

                <div className={styles.newsListContainer}>
                  <div className={styles.newsListInner}>
                    {newsList.map(news => (
                      <Link key={news.id} href={`/news/${news.id}`} className={styles.newsItem}>
                        {news.title}
                      </Link>
                    ))}
                    {newsList.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No recent news.</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leaders Voice Section */}
      <section className="section">
        <div className="container" style={{ textAlign: "center" }}>
          <h2 className="section-title">Leaders Voice</h2>
          <p className="section-subtitle">Messages from our visionary leadership.</p>
          <LeadersSlider />
        </div>
      </section>

      {/* Funding Section */}
      <section className={styles.fundingSection}>
        <div className="container">
          <h2 className="section-title" style={{ marginBottom: "3rem", fontSize: "2rem" }}>Collaborators</h2>
          <div className={styles.logoGrid}>
            {funding.map((fund) => (
              <div key={fund.id} title={fund.name} className={styles.logoWrapper}>
                {fund.id === "fund8" ? (
                  <span className={styles.fundText}>{fund.name}</span>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={fund.logo} alt={fund.name} className={styles.fundLogo} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="section" style={{ backgroundColor: 'var(--bg-alt)', padding: '4rem 0' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: "center", marginBottom: '3rem' }}>Lab Statistics</h2>
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                <AnimatedCounter end={publicationsCount} duration={2500} suffix="+" />
              </div>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 500 }}>Publications</p>
            </div>
            <div>
              <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                <AnimatedCounter end={10} duration={2500} suffix="+" />
              </div>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 500 }}>Patents Filed/Granted</p>
            </div>
            <div>
              <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                <AnimatedCounter end={5} duration={2500} />
              </div>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 500 }}>Ph.D. Awarded</p>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
