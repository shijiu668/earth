// app/pricing/page.js
'use client';

import { useState, useEffect } from 'react';
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

    // 当 Paddle.js 脚本加载后，执行最新的 Create 方法
    const handlePaddleLoad = async () => {
        console.log('Paddle.js script loaded. Attempting to initialize with Paddle.Create() (v2)...');

        // 使用 try-catch 来捕获任何初始化错误
        try {
            // 关键改动：使用 Paddle.Create() 来强制 V2 版本初始化
            const paddleInstance = await window.Paddle.Create({
                token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
                environment: 'sandbox',
                settings: {
                    displayMode: 'overlay', // 支付窗口以覆盖层形式显示
                    eventCallback: (data) => {
                        console.log('Paddle event:', data.name, data.data);
                        if (data.name === 'checkout.completed') {
                            alert('Subscription successful! Your credits will be updated shortly.');
                            window.location.href = '/';
                        }
                    },
                },
            });

            setPaddle(paddleInstance);
            setIsLoading(false);
            console.log('Paddle v2 initialized successfully!');

        } catch (error) {
            console.error('Failed to initialize Paddle v2:', error);
            alert('A critical error occurred with the payment system. Please contact support.');
            setIsLoading(false);
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

        paddle.Checkout.open({
            items: [{
                priceId: monthlyPlanPriceId,
                quantity: 1
            }],
            customer: {
                email: user.email,
            },
            customData: {
                user_id: user.id
            }
        });
    };

    return (
        <>
            <Script
                src="https://cdn.paddle.com/paddle/paddle.js"
                onLoad={handlePaddleLoad}
                onError={(e) => console.error('CRITICAL: Failed to load Paddle script:', e)}
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
                        </div>
                    </div>
                </section>
                <Footer />
            </main>
        </>
    );
}