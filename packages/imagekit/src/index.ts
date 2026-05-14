import ImageKit from "imagekit";
import { getSiteConfig } from "@workspace/database";

export interface ImageKitUploadResult {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  height: number;
  width: number;
  size: number;
  fileType: "image" | "non-image" | "video";
  filePath: string;
}

/**
 * Mendapatkan konfigurasi ImageKit dari Database (prioritas) atau Environment Variables
 */
async function getEffectiveConfig() {
  // Coba ambil dari Database dulu
  try {
    const dbConfig = await getSiteConfig();
    if (dbConfig?.imagekitPublicKey && dbConfig?.imagekitPrivateKey && dbConfig?.imagekitUrlEndpoint) {
      return {
        publicKey: dbConfig.imagekitPublicKey,
        privateKey: dbConfig.imagekitPrivateKey,
        urlEndpoint: dbConfig.imagekitUrlEndpoint,
      };
    }
  } catch (error) {
    console.warn("Could not fetch ImageKit config from database, falling back to ENV:", error);
  }

  // Fallback ke Env
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new Error("Missing ImageKit configuration. Please check your dashboard settings or environment variables.");
  }

  return { publicKey, privateKey, urlEndpoint };
}

export const getImageKitClient = async () => {
  const config = await getEffectiveConfig();
  return new ImageKit(config);
};

export const uploadToImageKit = async (file: string, fileName: string): Promise<ImageKitUploadResult> => {
  try {
    const client = await getImageKitClient();
    const result = await client.upload({
      file: file,
      fileName: fileName,
      folder: "uploads",
    });
    
    return {
      fileId: result.fileId,
      name: result.name,
      url: result.url,
      thumbnailUrl: result.thumbnailUrl,
      height: result.height,
      width: result.width,
      size: result.size,
      fileType: result.fileType as any,
      filePath: result.filePath,
    };
  } catch (error) {
    console.error("ImageKit upload error:", error);
    throw error;
  }
};

export const listImageKitFiles = async (limit = 100) => {
  try {
    const client = await getImageKitClient();
    const files = await client.listFiles({
      limit,
    });
    return files;
  } catch (error) {
    console.error("ImageKit list files error:", error);
    throw error;
  }
};

export const renameImageKitFile = async (filePath: string, newFileName: string) => {
  try {
    const client = await getImageKitClient();
    const result = await client.renameFile({
      filePath,
      newFileName,
    });
    return result;
  } catch (error) {
    console.error("ImageKit rename error:", error);
    throw error;
  }
};

export const getAuthenticationParameters = async () => {
  try {
    const client = await getImageKitClient();
    return client.getAuthenticationParameters();
  } catch (error) {
    console.error("ImageKit auth params error:", error);
    throw error;
  }
}
