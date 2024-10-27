export function extractVideoId(url: string) {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)|(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^&]+)/;
  const match = url.match(regex);
  return match ? match[1] || match[2] : null;
}