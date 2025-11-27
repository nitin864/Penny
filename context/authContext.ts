import { AuthContextType, UserType } from "@/types";
import React, { createContext, useState } from "react";

const authContext = createContext<AuthContextType | null>(null);

export const Authprovider : React.FC<{children: React.ReactNode}> = ({children})=> {
   const [user, setUser] = useState<UserType>(null)

   const login = async (email: string, password: string)=> {
   try{

   }catch(error: any)
    let msg =  error.message;
    return {success : false,msg}
    
   }
}