"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './LeadersSlider.module.css';
import { getDocuments } from '../services/firebaseCrud';

export default function LeadersSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [leaders, setLeaders] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeadersAndFounders = async () => {
      // Fetch leaders
      const leadersData = await getDocuments('leaders');
      
      // Fetch founders
      const allFaculty = await getDocuments('faculty');
      const foundersList = allFaculty.filter((f: any) => f.designation === 'Founder' || f.designation === 'founder');
      foundersList.sort((a: any, b: any) => {
        if (a.name.includes('Rath')) return -1;
        if (b.name.includes('Rath')) return 1;
        return 0;
      });

      // Merge both into the slider
      setLeaders([...leadersData, ...foundersList]);
    };
    fetchLeadersAndFounders();
  }, []);

  useEffect(() => {
    if (leaders.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % leaders.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [leaders]);

  if (leaders.length === 0) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading leaders...</div>;
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % leaders.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + leaders.length) % leaders.length);
  };

  return (
    <div className={styles.sliderContainer}>
      <div 
        className={styles.slidesWrapper}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {leaders.map((leader) => (
          <div key={leader.id} className={styles.slide}>
            <div className={styles.imageContainer}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {leader.image && <img src={leader.image} alt={leader.name} className={styles.slideImage} />}
            </div>
            <h3 className={styles.slideTitle}>{leader.name}</h3>
            <p className={styles.slideDesignation}>{leader.designation}</p>
            
            <div className={styles.talkWrapper}>
              <p className={styles.slideTalk}>
                {leader.talk || leader.bio || "Dedicated to advancing scientific research and innovation."}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <button className={`${styles.arrowBtn} ${styles.prevBtn}`} onClick={prevSlide} aria-label="Previous">
        <ChevronLeft size={32} />
      </button>

      <div className={styles.controls}>
        {leaders.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <button className={`${styles.arrowBtn} ${styles.nextBtn}`} onClick={nextSlide} aria-label="Next">
        <ChevronRight size={32} />
      </button>
    </div>
  );
}
