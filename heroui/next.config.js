/*!
 * Proxy Configuration
 * 
 * Copyright (c) 1984-2025 Jose Garcia
 * Released under the MIT license
 * https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/LICENSE.txt
 *
 * Date: 2025-04-26
*/

/** @type {import('next').NextConfig} */

const nextConfig = {

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/..../:path*', // Proxy to Backend
      },
    ];
  },
};


module.exports = nextConfig;
