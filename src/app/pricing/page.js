'use client';

import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../components/AuthProvider';

// 这些 ID 来自您在 Paddle 仪表盘中创建的产品
const PRO_MONTHLY_PRICE_ID = 'price_xxxxxxxxxxxxxx'; 
const PRO_YEARLY_PRICE_ID = 'price_yyyyyyyyyyyyyy';

const plans = [
    {
        name: 'Free Plan',
        price: '$0',
        features: ['20 initial credits', 'Generate 5s videos', 'Standard quality'],
        cta: 'Your Current Plan',
    },
    {
        name: 'Pro Monthly',
        price: '$10/month',
        features: ['150 credits per month', 'Generate 5s & 10s videos', 'HD quality', 'No watermarks'],
        priceId: PRO_MONTHLY_PRICE_ID,
        cta: 'Subscribe Now',
    },
];


export default function PricingPage() {
    const { user } = useAuth();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.paddle.com/paddle/paddle.js';
        script.async = true;
        script.onload = () => {
            Paddle.Setup({ 
                vendor: parseInt(process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID),
                // 使用 Paddle Client ID 模式
                token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_ID 
            });
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleSubscribe = (priceId) => {
        if (!user) {
            alert('Please login to subscribe.');
            return;
        }

        Paddle.Checkout.open({
            items: [{ priceId: priceId, quantity: 1 }],
            customer: {
                email: user.email,
            },
            customData: {
                user_id: user.id, // 将 Supabase user ID 传递给 Paddle
            }
        });
    };


    return (
        <main className="min-h-screen bg-black">
            <Header />
            <section className="section-padding pt-32">
                <div className="container text-center">
                    <h1 className="text-5xl font-bold mb-6 gradient-text">Choose Your Plan</h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Get more credits and unlock advanced features by subscribing to our Pro plan.
                    </p>
                </div>

                <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {plans.map((plan) => (
                        <div key={plan.name} className="card flex flex-col">
                            <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                            <p className="text-4xl font-bold my-4 gradient-text">{plan.price}</p>
                            <ul className="space-y-3 text-gray-300 flex-grow">
                                {plan.features.map(feat => <li key={feat}>✓ {feat}</li>)}
                            </ul>
                            <button 
                                onClick={() => handleSubscribe(plan.priceId)}
                                disabled={!plan.priceId}
                                className={`mt-8 w-full py-3 px-6 rounded-lg font-semibold transition-all ${!plan.priceId ? 'bg-gray-700 text-gray-500' : 'btn-primary'}`}>
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </section>
            <Footer />
        </main>
    );
}