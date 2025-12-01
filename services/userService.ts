import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, setDoc } from "firebase/firestore";

export const updateUser = async (
  uid: string,
  updatedData: UserDataType
): Promise<ResponseType> => {
  try {
    if (!uid) return { success: false, msg: "No UID provided" };

    const userRef = doc(firestore, "users", uid);

     
    await setDoc(userRef, updatedData, { merge: true });

    return { success: true, msg: "Updated Successfully" };
  } catch (error: any) {
    console.log("error updating the user", error);
    return { success: false, msg: error?.message ?? "Update failed" };
  }
};
