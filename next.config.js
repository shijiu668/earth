// next.config.js (FINAL MERGED VERSION)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 我们保留您已有的 images 配置
  images: {
    domains: ['replicate.delivery'],
  },

  async headers() {
    // --- 我们将更新您的内容安全策略 ---
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.stripe.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https://replicate.delivery https://*.stripe.com https://magicbox.tools;
      media-src 'self' https://replicate.delivery;
      font-src 'self' https://fonts.gstatic.com;
      frame-src 'self' https://*.stripe.com;
      connect-src 'self' https://*.supabase.co https://*.replicate.com https://*.stripe.com;
    `;

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\s{2,}/g, ' ').trim(),
          },
          // 保留您已有的其他安全头
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