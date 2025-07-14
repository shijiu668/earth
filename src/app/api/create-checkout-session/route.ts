// app/api/create-checkout-session/route.ts (FINAL & SIMPLIFIED VERSION)
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

        const { priceId } = await req.json();
        if (!priceId) {
            return new NextResponse(JSON.stringify({ error: 'Price ID is required.' }), { status: 400 });
        }

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('stripe_customer_id, subscription_plan')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            throw new Error('User profile not found.');
        }

        if (profile.subscription_plan === 'pro' && priceId === process.env.STRIPE_BASIC_PLAN_PRICE_ID) {
            return new NextResponse(
                JSON.stringify({ error: 'Cannot downgrade from the Pro plan.' }),
                { status: 400 }
            );
        }

        let customerId = profile.stripe_customer_id;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: { user_id: user.id },
            });
            customerId = customer.id;
            await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id);
        }

        // --- 核心修改点 ---
        // 我们彻底删除了之前条件化创建 subscriptionData 的逻辑，
        // 直接传递最基础的 metadata。
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            customer: customerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            subscription_data: {
                metadata: { user_id: user.id }
            },
            metadata: { user_id: user.id },
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
        });

        if (!session.url) {
            throw new Error('Could not create Stripe Checkout session.');
        }

        return NextResponse.json({ url: session.url });

    } catch (error) {
        console.error('Error creating Stripe Checkout session:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return new NextResponse(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
}