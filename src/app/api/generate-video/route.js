import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { generateEarthZoomOutVideo } from '../../../utils/replicate';

const VIDEO_GENERATION_COST = 10;

export async function POST(request) {
    const supabase = createRouteHandlerClient({ cookies: () => cookies() });

    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. 获取用户积分
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            throw new Error('Could not find user profile.');
        }

        // 2. 检查积分是否足够
        if (profile.credits < VIDEO_GENERATION_COST) {
            return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
        }

        // 3. 扣除积分
        const newCredits = profile.credits - VIDEO_GENERATION_COST;
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ credits: newCredits })
            .eq('id', user.id);

        if (updateError) {
            throw new Error('Failed to deduct credits.');
        }

        // 4. 积分扣除成功，开始生成视频
        const { image, duration, aspectRatio } = await request.json();

        if (!image) {
            return NextResponse.json({ error: 'Image is required' }, { status: 400 });
        }

        const videoUrl = await generateEarthZoomOutVideo(image, duration, aspectRatio);

        if (!videoUrl) {
            throw new Error('Video generation service failed.');
        }

        return NextResponse.json({
            success: true,
            videoUrl: videoUrl,
        });

    } catch (error) {
        console.error('Error in generate-video API:', error);
        // 如果出错，可以考虑将积分返还给用户，但这会增加逻辑复杂性
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}