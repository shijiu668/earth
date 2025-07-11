// app/pricing/page.js
'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../components/AuthProvider';

// 这些是 Paddle Billing 的测试价格 ID。
// 请登录您的 Paddle 后台 -> Catalog -> Products -> (选择您的产品) -> Prices 来获取您自己的 Price ID。
const monthlyPlanPriceId = 'pri_01jzxkebrjbf4m25kmsq8wpgch'; // 示例 Pro Monthly 价格 ID
const yearlyPlanPriceId = 'pri_01jzxkf131zhfqhhgqj13kxxp5';  // 示例 Pro Yearly 价格 ID

export default function PricingPage() {
    const [paddle, setPaddle] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth(); // 获取登录用户

    // 1. Paddle.js 脚本加载成功后，初始化 Paddle
    useEffect(() => {
        if (window.Paddle) {
            window.Paddle.Initialize({
                token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN, // 使用客户端专用的 Token
                environment: 'sandbox', // 使用沙箱环境进行测试
                eventCallback: (data) => {
                    // 监听支付成功事件
                    if (data.name === 'checkout.completed') {
                        // 支付成功后，我们的后端 webhook 会处理积分更新
                        // 这里可以重定向到感谢页面或刷新页面
                        console.log('Checkout completed!');
                        alert('Subscription successful! Your credits will be updated shortly.');
                        window.location.href = '/'; // 返回首页
                    }
                }
            }).then(p => {
                if (p) {
                    setPaddle(p);
                }
            }).catch(err => {
                console.error("Failed to initialize Paddle:", err);
            });
        }
    }, []);

    // 2. 处理订阅点击事件
    const handleCheckout = (priceId) => {
        if (!user) {
            alert('Please log in before subscribing.');
            return;
        }
        if (paddle) {
            setIsLoading(true);
            paddle.Checkout.open({
                items: [{
                    priceId: priceId,
                    quantity: 1
                }],
                customer: {
                    email: user.email // 预填入用户邮箱
                },
                customData: {
                    user_id: user.id // !! 关键：将Supabase用户ID传递给Paddle，用于webhook
                }
            });
            setIsLoading(false);
        } else {
            console.error('Paddle is not initialized yet.');
            alert('Payment system is not ready. Please try again in a moment.');
        }
    };

    return (
        <>
            {/* 关键：加载新版 Paddle.js 脚本 */}
            <Script
                src="https://cdn.paddle.com/paddle/paddle.js"
                onLoad={() => {
                    // 脚本加载后手动触发一次 useEffect
                    const event = new Event('load');
                    window.dispatchEvent(event);
                }}
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
                                    {isLoading ? 'Loading...' : 'Subscribe Now'}
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
                                    {isLoading ? 'Loading...' : 'Subscribe Now'}
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