import type { NextConfig } from 'next';
import path from 'path';

// const isProduction = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
 output: 'standalone',
 compress: false,
 //  ...(isProduction && {
 //   webpack: (config, { isServer }) => {
 //    config.resolve.alias['@'] = path.join(__dirname, './');
 //    return config;
 //   },
 //  }),
 webpack: (config, { isServer }) => {
  config.resolve.alias['@'] = path.join(__dirname, './');
  return config;
 },
};

export default nextConfig;
