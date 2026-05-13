"use server"

import { uploadImage } from "@workspace/cloudinary"
import { Asset } from "@workspace/assets"
import { revalidatePath } from "next/cache"

export async function uploadToCloudinaryAction(base64File: string, fileName: string): Promise<Asset> {
  try {
    const result = await uploadImage(base64File);
    
    const newAsset: Asset = {
      id: result.public_id,
      name: fileName,
      type: result.resource_type === 'image' ? 'image' : 
            result.resource_type === 'video' ? 'video' : 'document',
      size: `${(result.bytes / (1024 * 1024)).toFixed(1)} MB`,
      url: result.secure_url,
      createdAt: new Date().toISOString()
    };

    revalidatePath("/dashboard/assets")
    return newAsset;
  } catch (error) {
    console.error("Failed to upload to Cloudinary:", error);
    throw new Error("Upload failed");
  }
}
