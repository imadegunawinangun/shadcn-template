"use client";

import React from "react";
import { ImageKitProvider } from "imagekitio-next";

const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

export function ImageKitProviderWrapper({ children }: { children: React.ReactNode }) {
  if (!publicKey || !urlEndpoint) {
    return <>{children}</>;
  }

  return (
    <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint}>
      {children}
    </ImageKitProvider>
  );
}
