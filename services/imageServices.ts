import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/constants";
import { ResponseType } from "@/types";
import axios from "axios";

const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const uploadFileToCloudinary = async (
  file: { uri?: string } | string,
  folderName: string
): Promise<ResponseType> => {
  try {
    
    if (typeof file === "string") {
      return { success: true, data: file };
    }

    if (file && file.uri) {
      const formData = new FormData();

      const fileName = file.uri.split("/").pop() || "file.jpg";

      formData.append("file", {
        uri: file.uri,
        type: "image/jpeg",       
        name: fileName,
      } as any);

      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", folderName);

      const response = await axios.post(CLOUDINARY_API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",    
        },
      });

      console.log("upload image result:", response?.data);

      return { success: true, data: response?.data?.secure_url };
    }

    return { success: false, msg: "No file to upload" };
  } catch (error: any) {
    console.log("got error uploading the file", JSON.stringify(error, null, 2));
    return {
      success: false,
      msg:
        error?.response?.data?.error?.message ||
        error?.message ||
        "Could not upload File",
    };
  }
};

export const getProfileImage = (file: any) => {
  if (file && typeof file === "string") return file;
  if (file && typeof file === "object") return file.uri;

  return require("../assets/images/defaultAvatar.jpg");
};
