import React, { createContext, useContext, useState } from "react";
import { auth, firestore } from "@/config/firebase";
import { AuthContextType, UserType } from "@/types";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext<AuthContextType | null>(null);

export const Authprovider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // allow null initially
  const [user, setUser] = useState<UserType | null>(null);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      const msg = error?.message ?? "Login failed";
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

      // set local user state with minimal info
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
          name: data?.name ?? null, // fixed: was using image earlier
          image: data?.image ?? null,
        };
        setUser(userData);
      }
    } catch (error: any) {
      console.log("error: ", error);
    }
  };

  // keep contextValue minimal and cast to AuthContextType if your type is stricter
  const contextValue = {
    user,
    setUser,
    login,
    register,
    updateUserData,
  } as unknown as AuthContextType;

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// small, correct useAuth hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within Authprovider");
  }
  return context;
};

export default AuthContext;
