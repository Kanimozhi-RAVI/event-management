import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  
} from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

type User = {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: Date;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

interface Props { children: ReactNode }

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const userData = userDoc.data();

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || userData?.displayName || "",
          photoURL: firebaseUser.photoURL || userData?.photoURL || "",
          createdAt: userData?.createdAt?.toDate() || new Date(),
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const initialized = useRef(false);

useEffect(() => {
  if (initialized.current) return;
  initialized.current = true;

  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    try {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || userDoc.data()?.displayName || "",
          photoURL: firebaseUser.photoURL || userDoc.data()?.photoURL || "",
          createdAt: userDoc.data()?.createdAt?.toDate() || new Date(),
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("AuthContext error:", err);
      setUser(null);
    } finally {
      setLoading(false); // ✅ prevent loading stuck
    }
  });

  return unsubscribe;
}, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    await updateProfile(firebaseUser, { displayName });
    await setDoc(doc(db, "users", firebaseUser.uid), {
      uid: firebaseUser.uid,
      email,
      displayName,
      createdAt: new Date(),
      photoURL: "",
    });
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  
 return new Promise<void>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        unsubscribe();
        resolve();
      }
    });
  });
}
  const logout = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
