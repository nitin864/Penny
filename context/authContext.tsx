import { auth, firestore } from "@/config/firebase";
import { AuthContextType, UserType } from "@/types";
import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("firebase user: ", firebaseUser);

      if (firebaseUser) {
        setUser({
          uid: firebaseUser?.uid,
          email: firebaseUser?.email,
          name: firebaseUser?.displayName,
        });
        router.replace("/(tabs)");
      } else {
        //no user
        setUser(null);
        router.replace("/(auth)/welcome");
      }
    });

    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      let msg = error?.message ?? "Login failed";
      if (msg.includes("auth/invalid-credential")) msg = "Wrong credentials";
      if (msg.includes("auth/invalid-email")) msg = "Invalid email";

      return { success: false, msg };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const uid = response?.user?.uid;
      if (!uid) throw new Error("No UID returned from registration");

      await setDoc(doc(firestore, "users", uid), {
        name,
        email,
        uid,
      });

      setUser({
        uid,
        email,
        name,
        image: null,
      } as UserType);

      return { success: true };
    } catch (error: any) {
      const msg = error?.message ?? "Registration failed";
      return { success: false, msg };
    }
  };

  const updateUserData = async (uid: string) => {
    try {
      const docRef = doc(firestore, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const userData: UserType = {
          uid: data?.uid ?? uid,
          email: data?.email ?? null,
          name: data?.name ?? null,
          image: data?.image ?? null,
        };
        setUser(userData);
      }
    } catch (error: any) {
      console.log("error:", error);
    }
  };

  const contextValue = {
    user,
    setUser,
    login,
    register,
    updateUserData,
  } as unknown as AuthContextType;

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export default AuthContext;
