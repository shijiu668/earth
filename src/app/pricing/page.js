// app/pricing/page.js
'use client';

import { useState } from 'react';
import Script from 'next/script';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../components/AuthProvider';

// 再次确认这些是您 Paddle 沙箱环境中的 Pro Plan 的价格 ID
const monthlyPlanPriceId = 'pri_01jzxkebrjbf4m25kmsq8wpgch'; // 示例 Pro Monthly 价格 ID
const yearlyPlanPriceId = 'pri_01jzxkf131zhfqhhgqj13kxxp5';  // 示例 Pro Yearly 价格 ID

export default function PricingPage() {
    const [paddle, setPaddle] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // 初始时按钮应为加载状态
    const { user } = useAuth();

    // 1. 定义一个函数，在 Paddle.js 脚本加载完成后执行
    const handlePaddleLoad = () => {
        console.log('Paddle.js script loaded successfully.');
        // 检查 Paddle 是否已在 window 对象上
        if (window.Paddle) {
            window.Paddle.Initialize({
                token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
                environment: 'sandbox',
                eventCallback: (data) => {
                    console.log('Paddle event:', data); // 记录所有 Paddle 事件
                    if (data.name === 'checkout.completed') {
                        console.log('Checkout completed! Redirecting...');
                        alert('Subscription successful! Your credits will be updated shortly.');
                        window.location.href = '/';
                    }
                    if (data.name === 'checkout.closed') {
                        console.log('Checkout modal closed.');
                        setIsLoading(false); // 用户关闭弹窗后，重置按钮状态
                    }
                }
            }).then(p => {
                if (p) {
                    console.log('Paddle initialized successfully.');
                    setPaddle(p); // 保存 paddle 实例
                    setIsLoading(false); // 初始化成功，按钮变为可用
                }
            }).catch(err => {
                console.error('Failed to initialize Paddle:', err);
                alert('Could not initialize payment system. Please refresh the page.');
                setIsLoading(false);
            });
        } else {
            console.error('window.Paddle is not available after script load.');
        }
    };

    // 2. 处理订阅点击事件
    const handleCheckout = (priceId) => {
        console.log('handleCheckout called with priceId:', priceId);
        if (!user) {
            alert('Please log in before subscribing.');
            return;
        }
        if (!paddle) {
            console.error('Paddle is not initialized. Cannot open checkout.');
            alert('Payment system is not ready. Please wait or refresh the page.');
            return;
        }

        setIsLoading(true); // 点击后显示加载状态
        paddle.Checkout.open({
            items: [{
                priceId: priceId,
                quantity: 1
            }],
            customer: {
                email: user.email
            },
            customData: {
                user_id: user.id
            }
        });
    };

    return (
        <>
            {/* 关键：加载新版 Paddle.js 脚本，并在加载完成后调用 handlePaddleLoad */}
            <Script
                src="https://cdn.paddle.com/paddle/paddle.js"
                onLoad={handlePaddleLoad}
                onError={(e) => console.error('Failed to load Paddle script:', e)}
            />
            <main className="min-h-screen bg-black">
                <Header />
                <section className="section-padding">
                    <div className="container text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
                            Pricing Plans
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12">
                            Choose a plan to unlock more features and generate more videos.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Pro Monthly Plan */}
                            <div className="card">
                                <h3 className="text-2xl font-semibold text-white mb-4">Pro Monthly</h3>
                                <p className="text-5xl font-bold text-white mb-6">$15 <span className="text-lg font-normal text-gray-400">/ month</span></p>
                                <ul className="text-gray-300 space-y-3 mb-8 text-left">
                                    <li>✓ 150 Credits per month</li>
                                    <li>✓ Generate 5s & 10s videos</li>
                                    <li>✓ High-Quality Exports</li>
                                    <li>✓ Standard Support</li>
                                </ul>
                                <button onClick={() => handleCheckout(monthlyPlanPriceId)} disabled={isLoading || !paddle} className="btn-primary w-full">
                                    {isLoading ? 'Initializing...' : 'Subscribe Now'}
                                </button>
                            </div>

                            {/* Pro Yearly Plan */}
                            <div className="card border-purple-500">
                                <h3 className="text-2xl font-semibold text-white mb-4">Pro Yearly</h3>
                                <p className="text-5xl font-bold text-white mb-6">$150 <span className="text-lg font-normal text-gray-400">/ year</span></p>
                                <ul className="text-gray-300 space-y-3 mb-8 text-left">
                                    <li>✓ 2000 Credits per year</li>
                                    <li>✓ Generate 5s & 10s videos</li>
                                    <li>✓ High-Quality Exports</li>
                                    <li>✓ Priority Support</li>
                                </ul>
                                <button onClick={() => handleCheckout(yearlyPlanPriceId)} disabled={isLoading || !paddle} className="btn-primary w-full">
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