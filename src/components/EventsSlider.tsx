"use client";

import { useState, useEffect } from 'react';
import styles from './EventsSlider.module.css';

const dummyEvents = [
  {
    id: 1,
    title: "Annual Lab Festival 2026",
    description: "Celebrating our achievements and welcoming new researchers. A day filled with scientific poster presentations and cultural events.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 2,
    title: "International Nanotechnology Seminar",
    description: "Guest lectures from leading experts in solid-state physics, discussing the future of quantum materials and energy storage.",
    image: "https://images.unsplash.com/photo-1475721025585-249e0a0ee447?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 3,
    title: "New XRD Machine Installation",
    description: "Upgrading our structural analysis capabilities with state-of-the-art equipment to push the boundaries of materials research.",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 4,
    title: "Advanced Biomaterials Workshop",
    description: "Hands-on training session for PhD scholars and MPharm researchers focusing on novel drug delivery systems.",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1200",
  }
];

export default function EventsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % dummyEvents.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={styles.sliderContainer}>
      <div 
        className={styles.slidesWrapper}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {dummyEvents.map((event) => (
          <div key={event.id} className={styles.slide}>
            <div className={styles.imageOverlay}></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={event.image} alt={event.title} className={styles.slideImage} />
            <div className={styles.slideContent}>
              <h3 className={styles.slideTitle}>{event.title}</h3>
              <p className={styles.slideDesc}>{event.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.controls}>
        {dummyEvents.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
