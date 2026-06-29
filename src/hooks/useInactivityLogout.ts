import { useEffect, useRef, useCallback } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { updateLastActive, removeCurrentSession } from '../firebase/sessionManager';

const INACTIVITY_LIMIT_MS = 10 * 60 * 1000; // 10 minutes
const UPDATE_INTERVAL_MS = 3 * 60 * 1000; // Update lastActive every 3 minutes

export const useInactivityLogout = (uid: string | null) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const performLogout = useCallback(async () => {
    if (uid) {
      alert("Session expired due to inactivity.");
      await removeCurrentSession(uid);
      await signOut(auth);
    }
  }, [uid]);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(performLogout, INACTIVITY_LIMIT_MS);
  }, [performLogout]);

  useEffect(() => {
    if (!uid) return;

    // Reset timer on activity
    const activityEvents = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    
    const handleActivity = () => {
      resetTimer();
    };

    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Start initial timer
    resetTimer();

    // Start interval to update lastActive in Firestore
    updateIntervalRef.current = setInterval(() => {
      updateLastActive(uid);
    }, UPDATE_INTERVAL_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (updateIntervalRef.current) clearInterval(updateIntervalRef.current);
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [uid, resetTimer]);
};
