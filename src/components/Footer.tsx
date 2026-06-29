import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Monitor } from "lucide-react";
import styles from "./Footer.module.css";
import LastUpdatedText from "./LastUpdatedText";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.footerBrand}>
          <div className={styles.logo} style={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpg" alt="Herbal Nanotechnology Lab Logo" className={styles.logoImg} />
            </Link>
            <a href="https://soa.ac.in" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
              <img src="/SOA_logo.png" alt="SOA Logo" className={styles.logoImg} />
            </a>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit', marginLeft: '10px' }}>
              <span>Herbal Nanotechnology Lab</span>
            </Link>
          </div>
          <p className={styles.description}>
            Dedicated to the discovery, synthesis, and characterization of novel materials.
          </p>
        </div>

        <div className={styles.footerLinks}>
          <h4 className={styles.heading}>Quick Links</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/equipment">Equipment</Link></li>
            <li><Link href="/research">Researchers</Link></li>
            <li><Link href="/services">Services</Link></li>
          </ul>
        </div>

        <div className={styles.footerContact}>
          <h4 className={styles.heading}>Contact Us</h4>
          <ul>
            <li style={{ alignItems: 'flex-start' }}>
              <MapPin size={16} style={{ marginTop: '4px', flexShrink: 0 }} />
              <span>
                <strong>Herbal Nanotechnology Lab</strong><br />
                1. School of Pharmaceutical Sciences (3rd Floor)<br />
                2. 5th Floor, MLVP<br />
                SIKSHA O ANUSANDHAN, CAMPUS- 2<br />
                KALINGANAGAR, BHUBANESWAR<br />
                ODISHA, PIN- 751003<br />
                <iframe
                  src="https://maps.google.com/maps?q=7QMG%2BP48,+Kalinganagar,+Bhubaneswar,+Odisha+751029&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="150"
                  style={{ border: 0, borderRadius: '8px', marginTop: '1rem', marginBottom: '1rem' }}
                  allowFullScreen={false}
                  loading="lazy"
                ></iframe>
              </span>
            </li>
            <li>
              <Phone size={16} />
              <span>+91 98882 06383</span>
            </li>
            <li style={{ alignItems: 'flex-start' }}>
              <Mail size={16} style={{ marginTop: '4px', flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <a href="mailto:dbtbuildersoadu2022@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>dbtbuildersoadu2022@gmail.com</a>
                <a href="mailto:goutamrath123@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>goutamrath123@gmail.com</a>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <div className={`container ${styles.footerBottomFlex}`}>
          <div className={styles.footerBottomLeft}>
            <Monitor size={14} className={styles.icon} />
            <LastUpdatedText />
          </div>
          <div className={styles.footerBottomCenter}>
            <p>&copy; 2026 Herbal Nanotechnology Lab. All rights reserved. | Developed by <a href="https://devdeveswar1115.github.io/" target="_blank" rel="noopener noreferrer" className={styles.devLink}>Dev D Rana</a></p>
          </div>
          <div className={styles.footerBottomRight}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Originally rendered and tested on 
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style={{ height: '14px', width: '12px', fill: 'currentColor', margin: '0 4px' }}>
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
              </svg>
              liquid retina XDR display
            </div>
            <div>Best viewed on Chromium-based browsers with resolution &ge; (2560 &times; 1600)</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
