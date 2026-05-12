import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, Microscope } from "lucide-react";
import { labData } from "@/data/lab";
import styles from "./page.module.css";
import EventsSlider from "@/components/EventsSlider";

// const NanoAnimation = dynamic(() => import('@/components/NanoAnimation'), { ssr: false });
//import NanoAnimation from '@/components/NanoAnimation';
export default function Home() {
  const { about, founders, funding, gallery } = labData;

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

      {/* Founders Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Leadership & Founders</h2>
          <p className="section-subtitle">Guiding our mission to advance fundamental materials research.</p>

          <div className="grid grid-2">
            {founders.map((founder) => (
              <div key={founder.id} className="card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={founder.image} 
                  alt={founder.name} 
                  className={styles.founderImage} 
                  style={{ objectPosition: (founder as any).imagePosition || 'top center' }} 
                />
                <h3 className={styles.founderName}>{founder.name}</h3>
                {founder.qualification && (
                  <p className={styles.founderRole} style={{ marginBottom: "0.25rem", color: "var(--text-main)" }}>
                    <strong>Qualification:</strong> {founder.qualification}
                  </p>
                )}
                <p className={styles.founderRole}>{founder.designation}</p>
                <p style={{ color: 'var(--text-main)' }}>{founder.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
