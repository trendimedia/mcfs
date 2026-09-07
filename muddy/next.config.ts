// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'cautious-winner-69v545rvwg4v25w64-3000.app.github.dev',
      ],
    },
  },
};

export default nextConfig;