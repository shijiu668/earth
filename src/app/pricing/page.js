// app/pricing/page.js
'use client';

import { useState } from 'react';
import Script from 'next/script';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../components/AuthProvider';

const monthlyPlanPriceId = process.env.NEXT_PUBLIC_PADDLE_PRO_MONTHLY_PRICE_ID;

export default function PricingPage() {
    const [paddle, setPaddle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    const handlePaddleLoad = async () => {
        console.log('===== Paddle Debug Start =====');
        console.log('Paddle.js script has loaded.');

        if (window.Paddle) {
            console.log('1. Raw window.Paddle object:', window.Paddle);
            console.log('2. Type of window.Paddle:', typeof window.Paddle);

            if (typeof window.Paddle === 'object' && window.Paddle !== null) {
                console.log('3. Available keys on window.Paddle:', Object.keys(window.Paddle));
            }

            try {
                console.log('4. Attempting to initialize Paddle v2...');

                // 使用 Paddle v2 的正确初始化方式
                await window.Paddle.Initialize({
                    token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
                    environment: 'sandbox', // 改为 'production' 当您准备上线时
                    eventCallback: function (data) {
                        console.log('Paddle event:', data);
                        if (data.name === 'checkout.completed') {
                            alert('Subscription successful! Your credits will be updated shortly.');
                            window.location.href = '/';
                        }
                    }
                });

                setPaddle(window.Paddle);
                setIsLoading(false);
                console.log('5. Paddle v2 initialized successfully!');

            } catch (error) {
                console.error('6. Error during initialization:', error);
                alert('支付系统初始化失败，请联系客服支持');
                setIsLoading(false);
            }

        } else {
            console.error('Error: window.Paddle object not found after script load.');
            setIsLoading(false);
        }
        console.log('===== Paddle Debug End =====');
    };

    const handleCheckout = () => {
        if (!user) {
            alert('请先登录再进行订阅。');
            return;
        }
        if (!paddle) {
            alert('支付系统未就绪，请刷新页面重试。');
            return;
        }

        try {
            // 使用 Paddle v2 的正确语法
            paddle.Checkout.open({
                items: [{
                    priceId: monthlyPlanPriceId,
                    quantity: 1
                }],
                customer: {
                    email: user.email
                },
                customData: {
                    user_id: user.id
                }
            });
        } catch (error) {
            console.error('Checkout error:', error);
            alert('启动支付失败，请重试或联系客服。');
        }
    };

    return (
        <>
            <Script
                src="https://cdn.paddle.com/paddle/v2/paddle.js"
                onLoad={handlePaddleLoad}
                onError={(e) => {
                    console.error('CRITICAL: Failed to load Paddle script:', e);
                    setIsLoading(false);
                    alert('支付系统加载失败，请检查网络连接。');
                }}
            />
            <main className="min-h-screen bg-black">
                <Header />
                <section className="section-padding">
                    <div className="container text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
                            价格方案
                        </h1>
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
                            <div className="card border-blue-500">
                                <h3 className="text-2xl font-semibold text-white mb-4">Pro 月付</h3>
                                <p className="text-5xl font-bold text-white mb-6">
                                    $15 <span className="text-lg font-normal text-gray-400">/ 月</span>
                                </p>
                                <ul className="text-gray-300 mb-6 space-y-2">
                                    <li>• 150 积分/月</li>
                                    <li>• 高质量视频生成</li>
                                    <li>• 优先处理</li>
                                    <li>• 邮件支持</li>
                                </ul>
                                <button
                                    onClick={handleCheckout}
                                    disabled={isLoading || !paddle}
                                    className="btn-primary w-full"
                                >
                                    {isLoading ? '初始化中...' : '立即订阅'}
                                </button>
                            </div>
                            <div className="card">
                                <h3 className="text-2xl font-semibold text-white mb-4">免费试用</h3>
                                <p className="text-5xl font-bold text-white mb-6">
                                    $0 <span className="text-lg font-normal text-gray-400">/ 月</span>
                                </p>
                                <ul className="text-gray-300 mb-6 space-y-2">
                                    <li>• 10 积分/月</li>
                                    <li>• 标准质量</li>
                                    <li>• 社区支持</li>
                                </ul>
                                <button className="btn-secondary w-full" disabled>
                                    当前方案
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