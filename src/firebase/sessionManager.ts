import { db } from './config';
import { collection, query, where, getDocs, doc, setDoc, deleteDoc, updateDoc, serverTimestamp, orderBy } from 'firebase/firestore';

const SESSION_COLLECTION = 'adminSessions';
const MAX_SESSIONS = 2;

export const generateDeviceId = () => {
  if (typeof window === 'undefined') return 'server';
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
};

export const loginSession = async (uid: string) => {
  const deviceId = generateDeviceId();
  if (deviceId === 'server') return { success: true };

  const sessionsRef = collection(db, SESSION_COLLECTION);
  const q = query(sessionsRef, where('uid', '==', uid));
  const querySnapshot = await getDocs(q);

  let activeSessions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
  
  // Sort by loginTime ascending in memory to avoid needing a Firestore composite index
  activeSessions.sort((a, b) => {
    const timeA = a.loginTime?.toDate?.()?.getTime() || 0;
    const timeB = b.loginTime?.toDate?.()?.getTime() || 0;
    return timeA - timeB;
  });

  // Cleanup stale sessions first (older than 30 minutes)
  const now = new Date();
  for (const session of activeSessions) {
    if (session.lastActive && typeof session.lastActive.toDate === 'function') {
      const lastActiveTime = session.lastActive.toDate().getTime();
      if ((now.getTime() - lastActiveTime) > 30 * 60 * 1000) {
        await deleteDoc(doc(db, SESSION_COLLECTION, session.id));
        activeSessions = activeSessions.filter(s => s.id !== session.id);
      }
    }
  }

  const currentSessionExists = activeSessions.find(s => s.deviceId === deviceId);

  if (!currentSessionExists && activeSessions.length >= MAX_SESSIONS) {
    return {
      success: false,
      requiresConfirmation: true,
      oldestSessionId: activeSessions[0].id
    };
  }

  // Create or update session
  await createSession(uid, deviceId);
  return { success: true };
};

export const createSession = async (uid: string, deviceId: string) => {
  const sessionRef = doc(db, SESSION_COLLECTION, `${uid}_${deviceId}`);
  await setDoc(sessionRef, {
    uid,
    deviceId,
    loginTime: serverTimestamp(),
    lastActive: serverTimestamp()
  });
};

export const removeOldestSession = async (sessionId: string) => {
  await deleteDoc(doc(db, SESSION_COLLECTION, sessionId));
};

export const updateLastActive = async (uid: string) => {
  const deviceId = generateDeviceId();
  if (deviceId === 'server') return;
  const sessionRef = doc(db, SESSION_COLLECTION, `${uid}_${deviceId}`);
  try {
    await updateDoc(sessionRef, {
      lastActive: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating last active", error);
  }
};

export const removeCurrentSession = async (uid: string) => {
  const deviceId = generateDeviceId();
  if (deviceId === 'server') return;
  const sessionRef = doc(db, SESSION_COLLECTION, `${uid}_${deviceId}`);
  try {
    await deleteDoc(sessionRef);
  } catch (error) {
    console.error("Error removing session", error);
  }
};
