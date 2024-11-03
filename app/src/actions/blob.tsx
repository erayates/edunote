"use server";

import { del, list } from "@vercel/blob";

export const checkImageDeleted = async (images: string[]) => {
  try {
    const response = await list();
    const noteImageURLs = images;
    const imageBlobURLs = response.blobs.map((blob) => blob.url);

    if (!(imageBlobURLs.length > 0)) return;

    imageBlobURLs.map((imageBlobURL) => {
      if (!noteImageURLs.includes(imageBlobURL)) del(imageBlobURL);
    });
  } catch {
    return false;
  }
};
