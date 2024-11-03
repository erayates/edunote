/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "img.clerk.com",
            },
            {
                hostname: "brnx9rsmvjqlixb6.public.blob.vercel-storage.com"
            },
            {
                hostname: "fastly.picsum.photos",
            }
        ]
    }
};

export default nextConfig;
