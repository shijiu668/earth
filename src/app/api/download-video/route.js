// src/app/api/download-video/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // 从请求的 URL 中获取视频的实际地址
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get('videoUrl');

    if (!videoUrl) {
      return new NextResponse('Missing videoUrl parameter', { status: 400 });
    }

    // 在服务器端获取视频文件
    const videoResponse = await fetch(videoUrl);

    if (!videoResponse.ok) {
      throw new Error(`Failed to fetch video: ${videoResponse.statusText}`);
    }

    const videoBlob = await videoResponse.blob();

    // 创建一个新的响应，将视频作为附件返回
    const headers = new Headers();
    headers.set('Content-Type', 'video/mp4');
    headers.set(
      'Content-Disposition',
      `attachment; filename="ai-earth-zoom-out-${Date.now()}.mp4"`
    );

    return new Response(videoBlob, { headers });

  } catch (error) {
    console.error('Download proxy error:', error);
    return new NextResponse('Failed to download video', { status: 500 });
  }
}