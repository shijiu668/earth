// app/pricing/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CheckCircle, Star } from 'lucide-react';

export default function PricingPage() {
    const { user, profile } = useAuth();
    const [isLoading, setIsLoading] = useState(null); // String to track loading state for each button

    // 新增：判断用户的当前计划
    const currentPlan = profile?.subscription_plan;

    const handleCheckout = async (priceId) => {
        if (!user) {
            alert('Please log in or sign up to subscribe.');
            return;
        }
        setIsLoading(priceId);

        try {
            // 将 priceId 发送到后端
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId }),
            });

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error || 'Failed to create checkout session.');
            }
            const data = await response.json();
            window.location.href = data.url;
        } catch (error) {
            console.error('Checkout error:', error);
            alert(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred.'}`);
            setIsLoading(null);
        }
    };

    const plans = [
        {
            name: 'Basic',
            price: '$3.99',
            credits: '50 Credits / month',
            priceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PLAN_PRICE_ID,
            features: ['50 Credits per month', 'Generate 5s & 10s Videos'],
            isPopular: false,
        },
        {
            name: 'Pro',
            price: '$15',
            credits: '240 Credits / month',
            priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PLAN_PRICE_ID,
            features: ['240 Credits per month', 'Generate 5s & 10s Videos', 'High-Definition Quality', 'No Watermark'],
            isPopular: true,
        },
    ];

    return (
        <main className="min-h-screen bg-black">
            <Header />
            <div className="bg-gray-950 section-padding">
                <div className="container">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Pricing</h1>
                        <p className="text-xl text-gray-300">Choose the plan that's right for you.</p>
                    </div>

                    {/* 修改为并排展示两个计划 */}
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16 items-start">
                        {plans.map((plan) => {
                            const isCurrentPlan = currentPlan === plan.name.toLowerCase();
                            // Pro 用户不能订阅 Basic 计划
                            const isDisabled = isLoading || isCurrentPlan || (currentPlan === 'pro' && plan.name === 'Basic');

                            return (
                                <div key={plan.name} className={`card ${plan.isPopular ? 'border-2 border-blue-500 shadow-blue-500/20' : ''}`}>
                                    <div className="text-center">
                                        <h2 className="text-3xl font-bold text-white mb-2">{plan.name}</h2>
                                        <p className="text-gray-400 mb-6">{plan.credits}</p>
                                        <div className="mb-8">
                                            <span className="text-5xl font-extrabold text-white">{plan.price}</span>
                                            <span className="text-gray-400"> / month</span>
                                        </div>
                                    </div>
                                    <ul className="space-y-4 mb-10">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-center">
                                                <CheckCircle className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
                                                <span className="text-gray-300">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={() => handleCheckout(plan.priceId)}
                                        disabled={isDisabled}
                                        className="w-full btn-primary text-lg disabled:bg-gray-700 disabled:from-gray-600 disabled:to-gray-800 disabled:cursor-not-allowed disabled:scale-100"
                                    >
                                        {isCurrentPlan ? 'Current Plan' : (isLoading === plan.priceId ? 'Redirecting...' : (currentPlan === 'basic' && plan.name === 'Pro' ? 'Upgrade to Pro' : 'Get Started'))}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}