/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    prependData: `
      @import "src/styles/var";
    `,
  },
};

module.exports = nextConfig;
