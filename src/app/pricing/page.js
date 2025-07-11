// app/pricing/page.js
'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../components/AuthProvider';

const monthlyPlanPriceId = process.env.NEXT_PUBLIC_PADDLE_PRO_MONTHLY_PRICE_ID;

export default function PricingPage() {
    const [paddle, setPaddle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user, profile, loading } = useAuth();

    useEffect(() => {
        console.log('=== Environment Debug ===');
        console.log('Price ID:', monthlyPlanPriceId);
        console.log('Client Token:', process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN);
        console.log('Token type:', process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN?.startsWith('test_') ? 'SANDBOX' : 'PRODUCTION');
        console.log('========================');
    }, []);

    const handlePaddleLoad = async () => {
        console.log('===== Paddle Debug Start =====');

        if (window.Paddle) {
            try {
                console.log('4. Attempting to initialize Paddle v2...');

                await window.Paddle.Initialize({
                    token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
                    eventCallback: function (data) {
                        console.log('Paddle event:', data);
                        if (data.name === 'checkout.completed') {
                            alert('Subscription successful! Your credits will be updated shortly.');
                            window.location.href = '/';
                        }
                        if (data.name === 'checkout.error') {
                            console.error('Checkout Error Details:', data);
                            alert(`Checkout failed: ${data.detail || 'Unknown error'}`);
                        }
                    }
                });

                setPaddle(window.Paddle);
                setIsLoading(false);
                console.log('5. Paddle v2 initialized successfully!');

            } catch (error) {
                console.error('6. Error during initialization:', error);
                alert('A critical error occurred with the payment system. Please contact support');
                setIsLoading(false);
            }

        } else {
            console.error('Error: window.Paddle object not found after script load.');
            setIsLoading(false);
        }
        console.log('===== Paddle Debug End =====');
    };

    const handleCheckout = () => {
        if (loading) {
            alert('Please wait while we verify your login status...');
            return;
        }

        if (!user) {
            alert('Please log in before subscribing.');
            return;
        }

        if (!paddle) {
            alert('Payment system is not ready. Please refresh.');
            return;
        }

        try {
            console.log('=== Checkout Attempt ===');
            console.log('Price ID being used:', monthlyPlanPriceId);
            console.log('User email:', user.email);
            console.log('User ID:', user.id);
            console.log('=======================');

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
            alert('Failed to start checkout. Please try again or contact support.');
        }
    };

    // 测试不同的价格 ID
    const handleTestCheckout = () => {
        if (!paddle || !user) return;

        // 使用一个测试价格ID（您需要在 Paddle 中创建一个简单的测试产品）
        const testPriceId = 'pri_01test123'; // 替换为您的测试价格ID

        paddle.Checkout.open({
            items: [{
                priceId: testPriceId,
                quantity: 1
            }],
            customer: {
                email: user.email
            }
        });
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-black">
                <Header />
                <section className="section-padding">
                    <div className="container text-center">
                        <div className="text-white">Loading...</div>
                    </div>
                </section>
                <Footer />
            </main>
        );
    }

    return (
        <>
            <Script
                src="https://cdn.paddle.com/paddle/v2/paddle.js"
                onLoad={handlePaddleLoad}
                onError={(e) => {
                    console.error('CRITICAL: Failed to load Paddle script:', e);
                    setIsLoading(false);
                }}
            />
            <main className="min-h-screen bg-black">
                <Header />
                <section className="section-padding">
                    <div className="container text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
                            Pricing Plans - Debug Mode
                        </h1>

                        {/* 详细调试信息 */}
                        <div className="mb-8 p-4 bg-gray-800 rounded text-left text-sm max-w-2xl mx-auto">
                            <div className="text-white mb-2">Debug Information:</div>
                            <div className="text-green-400">✅ Price ID: {monthlyPlanPriceId}</div>
                            <div className="text-green-400">✅ Environment: {process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN?.startsWith('test_') ? 'SANDBOX' : 'PRODUCTION'}</div>
                            <div className={user ? 'text-green-400' : 'text-red-400'}>
                                {user ? '✅' : '❌'} User: {user ? `Logged in as ${user.email}` : 'Not logged in'}
                            </div>
                            <div className={paddle ? 'text-green-400' : 'text-red-400'}>
                                {paddle ? '✅' : '❌'} Paddle: {paddle ? 'Ready' : 'Not ready'}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
                            <div className="card border-blue-500">
                                <h3 className="text-2xl font-semibold text-white mb-4">Pro Monthly</h3>
                                <p className="text-5xl font-bold text-white mb-6">
                                    $15 <span className="text-lg font-normal text-gray-400">/ month</span>
                                </p>
                                <div className="space-y-4">
                                    <button
                                        onClick={handleCheckout}
                                        disabled={isLoading || !paddle || loading}
                                        className="btn-primary w-full"
                                    >
                                        {loading ? 'Checking login...' : isLoading ? 'Initializing...' : 'Subscribe Now'}
                                    </button>

                                    {/* 添加一个测试按钮 */}
                                    <button
                                        onClick={handleTestCheckout}
                                        disabled={isLoading || !paddle || loading}
                                        className="btn-secondary w-full text-sm"
                                    >
                                        Test Different Price ID
                                    </button>
                                </div>

                                {!loading && !user && (
                                    <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-600 rounded text-yellow-300 text-sm">
                                        Please log in to subscribe to a plan
                                    </div>
                                )}
                            </div>
                            <div className="card">
                                <h3 className="text-2xl font-semibold text-white mb-4">Free Trial</h3>
                                <p className="text-5xl font-bold text-white mb-6">
                                    $0 <span className="text-lg font-normal text-gray-400">/ month</span>
                                </p>
                                <button className="btn-secondary w-full" disabled>
                                    Current Plan
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