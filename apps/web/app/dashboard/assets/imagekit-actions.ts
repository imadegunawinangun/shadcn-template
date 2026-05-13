"use server"

import { uploadToImageKit } from "@workspace/imagekit"
import { Asset } from "@workspace/assets"
import { revalidatePath } from "next/cache"

export async function uploadToImageKitAction(base64File: string, fileName: string): Promise<Asset> {
  try {
    const result = await uploadToImageKit(base64File, fileName);
    
    const newAsset: Asset = {
      id: result.fileId,
      name: result.name,
      type: result.fileType === 'image' ? 'image' : 
            result.fileType === 'video' ? 'video' : 'document',
      size: `${(result.size / (1024 * 1024)).toFixed(1)} MB`,
      url: result.url,
      createdAt: new Date().toISOString()
    };

    revalidatePath("/dashboard/assets")
    return newAsset;
  } catch (error) {
    console.error("Failed to upload to ImageKit:", error);
    throw new Error("Upload failed");
  }
}
