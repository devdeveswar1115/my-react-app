"use client";

import { labData } from "@/data/lab";
import { Microscope, Award, Users, Trophy } from "lucide-react";
import Link from "next/link";
import styles from "../page.module.css";

export default function AboutPage() {
  const { about, gallery } = labData;

  return (
    <div className="section container">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="section-title">About the Lab</h1>
        <p className="section-subtitle">
          Dedicated to the discovery, synthesis, and characterization of novel materials.
        </p>
      </div>

      <div style={{ gap: '3rem', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
            {about.title}
          </h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-main)', marginBottom: '2rem' }}>
            {about.description}
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <Link href="/projects" style={{ textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: '1rem', color: 'inherit' }} className="about-link">
              <div style={{ backgroundColor: 'var(--bg-alt)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)', transition: 'background-color 0.2s' }}>
                <Microscope size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Research Projects</h3>
                <p style={{ color: 'var(--text-muted)' }}>Focusing on drug delivery, nanomedicine, and cancer therapeutics.</p>
              </div>
            </Link>
            
            <Link href="/research" style={{ textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: '1rem', color: 'inherit' }} className="about-link">
              <div style={{ backgroundColor: 'var(--bg-alt)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)', transition: 'background-color 0.2s' }}>
                <Users size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Researchers & Publications</h3>
                <p style={{ color: 'var(--text-muted)' }}>Led by visionary founders and supported by dedicated researchers and scholars.</p>
              </div>
            </Link>
            
            <Link href="/equipment" style={{ textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: '1rem', color: 'inherit' }} className="about-link">
              <div style={{ backgroundColor: 'var(--bg-alt)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)', transition: 'background-color 0.2s' }}>
                <Award size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>State-of-the-Art Equipment</h3>
                <p style={{ color: 'var(--text-muted)' }}>Explore our world-class analytical and formulation development facilities.</p>
              </div>
            </Link>

            <Link href="/achievements" style={{ textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: '1rem', color: 'inherit' }} className="about-link">
              <div style={{ backgroundColor: 'var(--bg-alt)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)', transition: 'background-color 0.2s' }}>
                <Trophy size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Achievements</h3>
                <p style={{ color: 'var(--text-muted)' }}>Discover the milestones, awards, and recognitions earned by our team.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '5rem' }}>
        <h2 className="section-title" style={{ textAlign: 'center' }}>Laboratory Environment</h2>
        <p className="section-subtitle" style={{ textAlign: 'center' }}>State-of-the-art facilities designed for groundbreaking discoveries.</p>

        <div className={styles.galleryGrid} style={{ marginTop: '3rem' }}>
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

      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
