import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Monitor } from "lucide-react";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.footerBrand}>
          <div className={styles.logo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="Herbal Nanotechnology Lab Logo" className={styles.logoImg} />
            <span>Herbal Nanotechnology Lab</span>
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
            <li>
              <MapPin size={16} />
              <span>123 Science Way, Innovation Park</span>
            </li>
            <li>
              <Phone size={16} />
              <span>+1 (555) 123-4567</span>
            </li>
            <li>
              <Mail size={16} />
              <span>info@advmatlab.edu</span>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <div className={`container ${styles.footerBottomFlex}`}>
          <div className={styles.footerBottomLeft}>
            <Monitor size={14} className={styles.icon} />
            <span>Last site update on May 02, 2026 13:56:00 (IST)</span>
          </div>
          <div className={styles.footerBottomCenter}>
            <p>&copy; 2026 Herbal Nanotechnology Lab. All rights reserved. | Developed by <a href="https://devdeveswar1115.github.io/" target="_blank" rel="noopener noreferrer" className={styles.devLink}>Dev D Rana</a></p>
          </div>
          <div className={styles.footerBottomRight}>
            <div>Originally rendered and tested on <i className={`fab fa-apple ${styles.icon}`} style={{ fontSize: '14px', margin: '0 2px' }}></i> liquid retina XDR display</div>
            <div>Best viewed on Chromium-based browsers with resolution &ge; (2560 &times; 1600)</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
