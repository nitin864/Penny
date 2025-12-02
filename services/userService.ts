import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, setDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageServices";

export const updateUser = async (
  uid: string,
  updatedData: UserDataType
): Promise<ResponseType> => {
  try {

   if(updatedData.image && updatedData?.image?.uri){
    const imageUploadRes = await uploadFileToCloudinary(updatedData.image, "users");
    if(!imageUploadRes.success){
        return {success: false, msg: imageUploadRes.msg || "Failed to upload Image"}
    }

    updatedData.image = imageUploadRes.data;
      
   }


    if (!uid) return { success: false, msg: "No UID provided" };

    const userRef = doc(firestore, "users", uid);

     
    await setDoc(userRef, updatedData, { merge: true });

    return { success: true, msg: "Updated Successfully" };
  } catch (error: any) {
    console.log("error updating the user", error);
    return { success: false, msg: error?.message ?? "Update failed" };
  }
};
