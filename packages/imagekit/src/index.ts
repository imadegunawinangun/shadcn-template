import ImageKit from "imagekit";

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

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
});

export const uploadToImageKit = async (file: string, fileName: string): Promise<ImageKitUploadResult> => {
  try {
    const result = await imagekit.upload({
      file: file,
      fileName: fileName,
      folder: "uploads",
    });
    
    // Map to our local interface to avoid leaking internal types
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
