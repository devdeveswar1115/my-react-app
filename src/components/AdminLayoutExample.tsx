"use client";

import React, { useEffect, useState } from 'react';
import { useInactivityLogout } from '../hooks/useInactivityLogout';
import { loginSession, removeOldestSession, createSession, generateDeviceId } from '../firebase/sessionManager';
import { auth } from '../firebase/config';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';

export const AdminLayoutExample = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [oldSessionId, setOldSessionId] = useState<string | null>(null);

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
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useInactivityLogout(user?.uid || null);

  const handleConfirmLogin = async () => {
    if (user && oldSessionId) {
      await removeOldestSession(oldSessionId);
      await createSession(user.uid, generateDeviceId());
      setShowConfirmModal(false);
      setUser(user);
    }
  };

  const handleCancelLogin = async () => {
    await signOut(auth);
    setShowConfirmModal(false);
  };

  if (loading) return <div>Loading...</div>;

  if (showConfirmModal) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">Login Limit Reached</h2>
          <p className="mb-6">
            You are already logged in on two devices. Do you want to log out another device and continue?
          </p>
          <div className="flex justify-end gap-4">
            <button 
              onClick={handleCancelLogin}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirmLogin}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Continue & Logout Other
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div>Please log in to access the admin panel.</div>;
  }

  return (
    <div>
      <nav className="bg-gray-800 text-white p-4 flex justify-between">
        <h1>Admin Dashboard</h1>
        <button onClick={() => signOut(auth)}>Sign Out</button>
      </nav>
      <main className="p-6">
        {children}
      </main>
    </div>
  );
};
