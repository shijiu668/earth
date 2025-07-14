// ===== DEBUGGING VERSION =====
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { generateEarthZoomOutVideo } from '../../../utils/replicate';

const VIDEO_GENERATION_COST = 10;

export async function POST(request) {
    console.log("\n--- [generate-video] API Request Received ---");

    // --- 调试点 1: 检查环境变量 ---
    console.log("DEBUG: Checking Environment Variables...");
    console.log(`DEBUG: SUPABASE_URL loaded: ${!!process.env.NEXT_PUBLIC_SUPABASE_URL}`);
    console.log(`DEBUG: SUPABASE_ANON_KEY loaded: ${!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`);
    console.log(`DEBUG: REPLICATE_API_TOKEN loaded: ${!!process.env.REPLICATE_API_TOKEN}`);

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    try {
        // --- 调试点 2: 检查请求中的 Cookie ---
        const allCookies = cookieStore.getAll();
        const supabaseAuthCookie = allCookies.find(c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'));
        console.log(`DEBUG: Supabase auth cookie found in request: ${!!supabaseAuthCookie}`);
        if (!supabaseAuthCookie) {
            console.log("DEBUG: No Supabase auth cookie found. All cookies:", allCookies.map(c => c.name));
        }

        // --- 调试点 3: 检查 Supabase getUser 的完整响应 ---
        console.log("DEBUG: Calling supabase.auth.getUser()...");
        const userResponse = await supabase.auth.getUser();

        console.log("DEBUG: supabase.auth.getUser() response:", {
            user: userResponse.data.user ? { id: userResponse.data.user.id, email: userResponse.data.user.email } : null,
            error: userResponse.error ? userResponse.error.message : null,
        });

        const { data: { user } } = userResponse;

        if (!user) {
            console.error("FINAL ERROR: Unauthorized access attempt. User not authenticated.");
            // 在返回前，把详细的错误信息也返回给前端，方便调试
            return NextResponse.json({
                error: 'Unauthorized',
                debug_info: `Supabase authentication failed. Reason: ${userResponse.error?.message || 'No active session cookie found.'}`
            }, { status: 401 });
        }

        // 如果代码能执行到这里，说明用户验证通过了
        console.log(`SUCCESS: User authenticated successfully. User ID: ${user.id}`);

        // 后续逻辑保持不变...
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) throw new Error('Could not find user profile.');

        const newCredits = profile.credits - VIDEO_GENERATION_COST;
        const { error: updateError } = await supabase.from('profiles').update({ credits: newCredits }).eq('id', user.id);
        if (updateError) throw new Error('Failed to deduct credits.');

        const { image, duration, aspectRatio } = await request.json();
        if (!image) return NextResponse.json({ error: 'Image is required' }, { status: 400 });

        const videoUrl = await generateEarthZoomOutVideo(image, duration, aspectRatio);
        if (!videoUrl) throw new Error('Video generation service failed.');

        return NextResponse.json({ success: true, videoUrl: videoUrl });

    } catch (error) {
        console.error('CRITICAL ERROR in catch block:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}