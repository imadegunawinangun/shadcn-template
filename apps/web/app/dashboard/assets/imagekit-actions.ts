"use server"

import { uploadToImageKit, listImageKitFiles, renameImageKitFile } from "@workspace/imagekit"
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
      path: result.filePath,
      createdAt: new Date().toISOString()
    };

    revalidatePath("/dashboard/assets")
    return newAsset;
  } catch (error) {
    console.error("Failed to upload to ImageKit:", error);
    throw new Error("Upload failed");
  }
}

export async function listAssetsImageKitAction() {
  console.log("🔍 Fetching assets from ImageKit...");
  try {
    const files = await listImageKitFiles();
    console.log(`✅ Found ${files.length} assets in ImageKit`);
    
    const assets: Asset[] = files.map(file => {
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'avif', 'bmp', 'tiff'];
      
      let type: "image" | "video" | "document" = "document";
      if (file.fileType === 'image' || imageExtensions.includes(extension)) {
        type = "image";
      } else if (videoExtensions.includes(extension)) {
        type = "video";
      }

      return {
        id: file.fileId,
        name: file.name,
        type,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        url: file.url,
        path: file.filePath,
        createdAt: file.createdAt as string
      };
    });

    return assets;
  } catch (error) {
    console.error("Failed to list assets from ImageKit:", error);
    return [];
  }
}

export async function renameAssetImageKitAction(filePath: string, newName: string, oldName: string) {
  try {
    if (!filePath) {
      throw new Error("File path is missing. Please refresh the page.");
    }

    // ImageKit filePath must start with /
    const cleanPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
    
    console.log("🛠️ Attempting rename:", { cleanPath, newName, oldName });

    // Ensure the new name has the same extension as the old name if not provided
    const oldExtension = oldName.split('.').pop()?.toLowerCase() || '';
    const newExtension = newName.split('.').pop()?.toLowerCase() || '';
    
    let finalName = newName;
    if (oldExtension && !newName.toLowerCase().endsWith(`.${oldExtension}`)) {
      finalName = `${newName}.${oldExtension}`;
    }

    await renameImageKitFile(cleanPath, finalName);
    revalidatePath("/dashboard/assets");
    return { success: true };
  } catch (error: any) {
    console.error("❌ ImageKit Rename Error:", {
      filePath,
      newName,
      message: error.message,
      stack: error.stack
    });
    throw new Error(error.message || "Rename failed");
  }
}
