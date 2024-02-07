/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'stylospectrum-images.s3.amazonaws.com',
      },
    ],
  },
  sassOptions: {
    prependData: `
      @import "src/styles/var";
    `,
  },
};

module.exports = nextConfig;
