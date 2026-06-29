"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useInactivityLogout } from '../hooks/useInactivityLogout';
import { loginSession, removeOldestSession, createSession, generateDeviceId } from '../firebase/sessionManager';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [oldSessionId, setOldSessionId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const result = await loginSession(currentUser.uid);
        if (result.requiresConfirmation) {
          setOldSessionId(result.oldestSessionId || null);
          setShowConfirmModal(true);
        } else {
          setUser(currentUser);
        }
      } else {
        setUser(null);
        router.push('/admin/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useInactivityLogout(user?.uid || null);

  const handleConfirmLogin = async () => {
    if (auth.currentUser && oldSessionId) {
      await removeOldestSession(oldSessionId);
      await createSession(auth.currentUser.uid, generateDeviceId());
      setShowConfirmModal(false);
      setUser(auth.currentUser);
    }
  };

  const handleCancelLogin = async () => {
    await signOut(auth);
    setShowConfirmModal(false);
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Loading Admin...</h2>
      </div>
    );
  }

  if (showConfirmModal) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', maxWidth: '28rem', width: '90%' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Login Limit Reached</h2>
          <p style={{ marginBottom: '1.5rem', color: '#4b5563' }}>
            You are already logged in on two devices. Do you want to log out another device and continue?
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button 
              onClick={handleCancelLogin}
              style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', backgroundColor: 'white', cursor: 'pointer', color: '#374151' }}
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirmLogin}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}
            >
              Continue & Logout Other
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
