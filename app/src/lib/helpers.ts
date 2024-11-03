export function extractVideoId(url: string) {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)|(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^&]+)/;
  const match = url.match(regex);
  return match ? match[1] || match[2] : null;
}

export const getRandomImageSet = () => {
  // Array of image sets (background, eye image)
  const imageSets = [
    {
      background: "/assets/images/the-tower.png",  // First background image
      eye: "/assets/images/eye-of-sauron-2.png",   // Corresponding first eye image
    },
    {
      background: "/assets/images/bg-button-ai.png",  // Second background image
      eye: "/assets/images/button-ai.png",        // Corresponding second eye image
    }
  ];

  // Randomly select one of the image sets
  const randomIndex = Math.floor(Math.random() * imageSets.length);
  console.log(randomIndex)
  return imageSets[randomIndex];
};