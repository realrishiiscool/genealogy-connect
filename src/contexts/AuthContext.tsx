import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signOut as fbSignOut, type User as FbUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  mobile: string | null;
  user_type: "admin" | "boutique_owner" | "customer";
  status: "active" | "pending" | "restricted";
  referral_code: string | null;
  referred_by: string | null;
  boutique_name: string | null;
  created_at: string;
};

type Ctx = {
  user: FbUser | null;
  session: any | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthCtx = createContext<Ctx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FbUser | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (uid: string) => {
    try {
      const docRef = doc(db, "profiles", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile({ id: docSnap.id, ...docSnap.data() } as Profile);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error(err);
      setProfile(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      setSession(fbUser ? { user: fbUser } : null);
      if (fbUser) {
        await loadProfile(fbUser.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthCtx.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signOut: async () => {
          await fbSignOut(auth);
        },
        refreshProfile: async () => {
          if (user) await loadProfile(user.uid);
        },
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const c = useContext(AuthCtx);
  if (!c) throw new Error("useAuth outside AuthProvider");
  return c;
}
