// app/api/cancel-subscription/route.ts
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
});

export async function POST(req: Request) {
    try {
        const supabase = createRouteHandlerClient({ cookies });
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        // 获取用户的订阅信息
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('stripe_subscription_id, subscription_plan')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            return new NextResponse(JSON.stringify({ error: 'User profile not found' }), { status: 404 });
        }

        if (!profile.stripe_subscription_id) {
            return new NextResponse(JSON.stringify({ error: 'No active subscription found' }), { status: 400 });
        }

        // 取消Stripe订阅（在当前计费周期结束时）
        const subscription = await stripe.subscriptions.update(
            profile.stripe_subscription_id,
            {
                cancel_at_period_end: true,
            }
        );

        // 更新数据库中的订阅状态
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                stripe_subscription_status: 'cancel_at_period_end'
            })
            .eq('id', user.id);

        if (updateError) {
            console.error('Error updating subscription status:', updateError);
            return new NextResponse(JSON.stringify({ error: 'Failed to update subscription status' }), { status: 500 });
        }

        console.log(`✅ Subscription cancelled for user ${user.id}. Subscription ID: ${subscription.id}`);

        return NextResponse.json({
            success: true,
            message: 'Subscription will be cancelled at the end of the current billing period.'
        });

    } catch (error) {
        console.error('Error cancelling subscription:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return new NextResponse(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
}