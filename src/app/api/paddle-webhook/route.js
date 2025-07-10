import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient'; // 使用 admin 权限的 supabase client
import { Paddle, EventName } from '@paddle/paddle-node-sdk'

// 在生产环境中，建议使用一个具有 admin 权限的 Supabase client 来更新用户数据
// const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
// 为简化，我们暂时还使用普通 client，但需调整RLS策略或使用 admin client

const paddle = new Paddle(process.env.PADDLE_API_KEY)

export async function POST(request) {
    const signature = request.headers.get('paddle-signature');
    const rawRequestBody = await request.text();
    const secret = process.env.PADDLE_WEBHOOK_SECRET;

    try {
        const event = paddle.webhooks.unmarshal(rawRequestBody, secret, signature);

        if (event.eventName === EventName.SubscriptionCreated || event.eventName === EventName.SubscriptionUpdated) {
            const userId = event.data.customData?.user_id;
            
            if (!userId) {
                console.warn('Webhook received but no user_id in custom_data');
                return NextResponse.json({ received: true });
            }

            // 获取当前积分
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('credits')
                .eq('id', userId)
                .single();

            if (profileError) throw new Error('Could not find user profile for webhook.');

            // 根据订阅计划增加积分
            const creditsToAdd = 150; // 假设 Pro plan 增加 150 积分
            const newCredits = (profile.credits || 0) + creditsToAdd;

            const { error } = await supabase
                .from('profiles')
                .update({ 
                    subscription_plan: 'pro',
                    credits: newCredits
                })
                .eq('id', userId);

            if (error) {
                console.error('Failed to update user profile from webhook:', error);
                throw new Error('Database update failed');
            }

            console.log(`Successfully updated profile for user ${userId}. Plan: pro, New Credits: ${newCredits}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Error handling Paddle webhook:', error.message);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }
}