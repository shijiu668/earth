// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['replicate.delivery'],
  },
  async headers() {
    // 定义内容安全策略 (CSP)
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.paddle.com https://public.profitwell.com;
      style-src 'self' 'unsafe-inline' https://cdn.paddle.com https://buy.paddle.com;
      img-src 'self' blob: data: https://replicate.delivery https://*.paddle.com https://buy.paddle.com;
      font-src 'self' data: https://fonts.gstatic.com https://at.alicdn.com https://cdn.paddle.com https://buy.paddle.com;
      frame-src 'self' https://checkout.paddle.com https://buy.paddle.com;
      connect-src 'self' https://*.supabase.co https://*.replicate.com https://*.paddle.com https://public.profitwell.com https://buy.paddle.com;
    `;

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\s{2,}/g, ' ').trim(), // 移除换行符和多余空格
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;