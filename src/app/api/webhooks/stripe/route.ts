// app/api/webhooks/stripe/route.ts (FINAL VERSION)
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

// 注意：这个版本不再需要bodyParser:false的配置，因为App Router的处理方式不同
// 如果之前添加了，可以删除。

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
    } catch (err: any) {
        console.error(`❌ Webhook signature verification failed: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.metadata?.user_id;
                const subscriptionId = session.subscription as string;

                if (!userId) throw new Error('User ID not found in session metadata.');

                const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                const priceId = subscription.items.data[0]?.price.id;

                if (!priceId) throw new Error('Price ID not found on subscription items.');

                let creditsToAdd = 0;
                let planName = 'free';

                if (priceId === process.env.STRIPE_BASIC_PLAN_PRICE_ID) {
                    creditsToAdd = 50;
                    planName = 'basic';
                } else if (priceId === process.env.STRIPE_PRO_PLAN_PRICE_ID) {
                    creditsToAdd = 240;
                    planName = 'pro';
                }

                const { data: profile, error } = await supabaseAdmin
                    .from('profiles')
                    .select('credits')
                    .eq('id', userId)
                    .single();

                if (error) throw new Error(`Could not find profile for user ${userId}.`);

                const newCredits = (profile.credits || 0) + creditsToAdd;

                await supabaseAdmin
                    .from('profiles')
                    .update({
                        stripe_subscription_id: subscription.id,
                        stripe_customer_id: subscription.customer as string,
                        stripe_subscription_status: subscription.status,
                        subscription_plan: planName,
                        credits: newCredits,
                    })
                    .eq('id', userId);

                console.log(`✅ Initial subscription successful for user ${userId}. Plan: ${planName}, Credits added: ${creditsToAdd}`);
                break;
            }

            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as any;
                if (invoice.billing_reason === 'subscription_cycle') {
                    const customerId = invoice.customer as string;
                    const subscriptionId = invoice.subscription as string;
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                    const priceId = subscription.items.data[0]?.price.id;

                    if (!priceId) throw new Error('Price ID not found on invoice renewal.');

                    let creditsToAdd = 0;
                    if (priceId === process.env.STRIPE_BASIC_PLAN_PRICE_ID) creditsToAdd = 50;
                    else if (priceId === process.env.STRIPE_PRO_PLAN_PRICE_ID) creditsToAdd = 240;

                    if (creditsToAdd > 0) {
                        const { data: profile } = await supabaseAdmin.from('profiles').select('id, credits').eq('stripe_customer_id', customerId).single();
                        if (profile) {
                            const newCredits = (profile.credits || 0) + creditsToAdd;
                            await supabaseAdmin.from('profiles').update({ credits: newCredits }).eq('id', profile.id);
                            console.log(`✅ Subscription renewed for user ${profile.id}. Credits added: ${creditsToAdd}.`);
                        }
                    }
                }
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;
                await supabaseAdmin.from('profiles').update({ stripe_subscription_status: subscription.status }).eq('stripe_customer_id', customerId);
                console.log(`✅ Subscription status for customer ${customerId} updated to ${subscription.status}.`);
                break;
            }
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                await supabaseAdmin
                    .from('profiles')
                    .update({
                        stripe_subscription_status: 'cancelled',
                        subscription_plan: 'free'
                    })
                    .eq('stripe_customer_id', customerId);

                console.log(`✅ Subscription deleted for customer ${customerId}. Plan reset to free.`);
                break;
            }
        }
    } catch (error) {
        console.error('❌ Webhook handler failed:', { error });
        return new NextResponse('Webhook handler failed.', { status: 500 });
    }

    return NextResponse.json({ received: true });
}