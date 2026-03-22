"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    signInWithPopup,
    GithubAuthProvider
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    userType: string;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signInWithGithub: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function Providers({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [userType, setUserType] = useState<string>("teen");

    // Fetch userType from Firestore when user changes
    useEffect(() => {
        if (!user) {
            setUserType("teen");
            return;
        }

        if (!db) {
            setUserType("teen");
            return;
        }

        const fetchUserType = async () => {
            if (!db) return;
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUserType(data.userType || "teen");
                }
            } catch (error) {
                console.error("Error fetching userType:", error);
                setUserType("teen");
            }
        };

        fetchUserType();
    }, [user]);

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        if (!auth) throw new Error("Auth not initialized");
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signUp = async (email: string, password: string) => {
        if (!auth) throw new Error("Auth not initialized");
        await createUserWithEmailAndPassword(auth, email, password);
    };

    const signInWithGoogle = async () => {
        if (!auth) throw new Error("Auth not initialized");
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    const signInWithGithub = async () => {
        if (!auth) throw new Error("Auth not initialized");
        const provider = new GithubAuthProvider();
        await signInWithPopup(auth, provider);
    };

    const signOut = async () => {
        if (!auth) throw new Error("Auth not initialized");
        await firebaseSignOut(auth);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            userType,
            signIn,
            signUp,
            signInWithGoogle,
            signInWithGithub,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within a Providers component");
    }
    return context;
}
