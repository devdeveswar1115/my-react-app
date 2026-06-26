"use client";

import { useEffect, useState } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function LastUpdatedText() {
  const [lastUpdated, setLastUpdated] = useState<string>("May 02, 2026 13:56:00 (IST)");

  useEffect(() => {
    const docRef = doc(db, 'metadata', 'site_info');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.lastUpdated) {
          const date = data.lastUpdated.toDate();
          // Format like: May 02, 2026 13:56:00 (IST)
          const formatted = date.toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'Asia/Kolkata',
            timeZoneName: 'short'
          });
          setLastUpdated(formatted);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return <span>Last site update on {lastUpdated}</span>;
}
