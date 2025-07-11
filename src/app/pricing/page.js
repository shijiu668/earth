// app/pricing/page.js
'use client';

import { useState } from 'react';
import Script from 'next/script';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../components/AuthProvider';

// 从环境变量中获取您的 Paddle Billing 价格 ID
const monthlyPlanPriceId = process.env.NEXT_PUBLIC_PADDLE_PRO_MONTHLY_PRICE_ID;

export default function PricingPage() {
    const [paddle, setPaddle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    // 当 Paddle.js 脚本加载后，执行 Initialize
    const handlePaddleLoad = () => {
        if (window.Paddle) {
            window.Paddle.Initialize({
                token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN, // Billing 使用 Client Token
                environment: 'sandbox',
                eventCallback: (data) => {
                    if (data.name === 'checkout.completed') {
                        alert('Subscription successful! Your credits will be updated shortly.');
                        window.location.href = '/';
                    }
                }
            }).then(p => {
                if (p) {
                    setPaddle(p);
                    setIsLoading(false);
                }
            }).catch(err => {
                console.error("Failed to initialize Paddle Billing:", err);
                setIsLoading(false);
            });
        }
    };

    // 处理订阅点击事件
    const handleCheckout = () => {
        if (!user) {
            alert('Please log in before subscribing.');
            return;
        }
        if (!paddle) {
            alert('Payment system is not ready. Please refresh.');
            return;
        }

        // Paddle Billing 的结账方式
        paddle.Checkout.open({
            items: [{
                priceId: monthlyPlanPriceId,
                quantity: 1
            }],
            customer: {
                email: user.email,
            },
            customData: {
                user_id: user.id // 将 user_id 传递给 webhook
            }
        });
    };

    return (
        <>
            <Script
                src="https://cdn.paddle.com/paddle/paddle.js"
                onLoad={handlePaddleLoad}
            />
            <main className="min-h-screen bg-black">
                <Header />
                <section className="section-padding">
                    <div className="container text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
                            Pricing Plans
                        </h1>
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
                            {/* Pro Monthly Plan */}
                            <div className="card border-blue-500">
                                <h3 className="text-2xl font-semibold text-white mb-4">Pro Monthly</h3>
                                <p className="text-5xl font-bold text-white mb-6">$15 <span className="text-lg font-normal text-gray-400">/ month</span></p>
                                <button onClick={handleCheckout} disabled={isLoading || !paddle} className="btn-primary w-full">
                                    {isLoading ? 'Initializing...' : 'Subscribe Now'}
                                </button>
                            </div>
                            {/* Pro Yearly Plan */}
                            <div className="card">
                                <h3 className="text-2xl font-semibold text-white mb-4">Pro Yearly</h3>
                                <p className="text-5xl font-bold text-white mb-6">$150 <span className="text-lg font-normal text-gray-400">/ year</span></p>
                                <button disabled className="btn-secondary w-full">
                                    Coming Soon
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
            </main>
        </>
    );
}