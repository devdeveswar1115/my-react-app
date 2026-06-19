"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Microscope } from "lucide-react";
import { labData } from "@/data/lab";
import styles from "./page.module.css";
import EventsSlider from "@/components/EventsSlider";
import LeadersSlider from "@/components/LeadersSlider";
import { getDocuments } from "@/services/firebaseCrud";

// const NanoAnimation = dynamic(() => import('@/components/NanoAnimation'), { ssr: false });
//import NanoAnimation from '@/components/NanoAnimation';
export default function Home() {
  const { about, funding, gallery } = labData;
  useEffect(() => {
    // Founders fetch moved to LeadersSlider if needed, or they just populate leaders collection
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
      <section className="section" style={{ backgroundColor: 'var(--bg-alt)' }}>
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

      {/* Events & Highlights Section */}
      <section className="section">
        <div className="container" style={{ textAlign: "center" }}>
          <h2 className="section-title">Events & Highlights</h2>
          <p className="section-subtitle">Catch up on our latest workshops, seminars, and lab activities.</p>
          <EventsSlider />
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

      {/* End Leaders Voice Section */}

      {/* Funding Section */}
      <section className={styles.fundingSection}>
        <div className="container">
          <h2 className="section-title" style={{ marginBottom: "3rem", fontSize: "2rem" }}>Supported By</h2>
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

      {/* Gallery Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Laboratory Environment</h2>
          <p className="section-subtitle">State-of-the-art facilities designed for groundbreaking discoveries.</p>

          <div className={styles.galleryGrid}>
            {gallery.map((img) => (
              <div key={img.id} className={styles.galleryItem}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.caption} className={styles.galleryImg} />
                <div className={styles.galleryCaption}>
                  <h4>{img.caption}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
