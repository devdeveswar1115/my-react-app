"use client";

import { useState, useEffect } from 'react';
import styles from './EventsSlider.module.css';
import { Calendar, MapPin } from 'lucide-react';
import { getDocuments } from '../services/firebaseCrud';

export default function EventsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await getDocuments('events');
      setEvents(data);
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [events]);

  if (events.length === 0) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>No events found.</div>;
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={styles.sliderContainer}>
      <div 
        className={styles.slidesWrapper}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {events.map((event) => (
          <div key={event.id} className={styles.slide}>
            <div className={styles.imageOverlay}></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {event.image && <img src={event.image} alt={event.title} className={styles.slideImage} />}
            <div className={styles.slideContent}>
              <h3 className={styles.slideTitle}>{event.title}</h3>
              {(event.date || event.venue) && (
                <div className={styles.slideMeta}>
                  {event.date && (
                    <span className={styles.metaItem}>
                      <Calendar size={14} /> {event.date}
                    </span>
                  )}
                  {event.venue && (
                    <span className={styles.metaItem}>
                      <MapPin size={14} /> {event.venue}
                    </span>
                  )}
                </div>
              )}
              <p className={styles.slideDesc}>{event.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.controls}>
        {events.map((_, index) => (
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
