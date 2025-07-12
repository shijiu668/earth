import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AI Earth Zoom Out',
    short_name: 'AI Earth Zoom',
    description: 'Create stunning earth zoom out videos with AI.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000', // 推荐使用黑色以匹配您的网站主题
    theme_color: '#000000', // 推荐使用黑色以匹配您的网站主题
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png', // 添加我们之前准备好的苹果图标
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}