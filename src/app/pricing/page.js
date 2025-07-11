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

                // 使用正确的 Paddle v2 初始化参数
                await window.Paddle.Initialize({
                    token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
                    // 移除 environment 参数，因为它在新版本中不存在
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
        if (!user) {
            alert('Please log in before subscribing.');
            return;
        }
        if (!paddle) {
            alert('Payment system is not ready. Please refresh.');
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
            alert('Failed to start checkout. Please try again or contact support.');
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
                    alert('Payment system failed to load. Please check your network connection.');
                }}
            />
            <main className="min-h-screen bg-black">
                <Header />
                <section className="section-padding">
                    <div className="container text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
                            Pricing Plans
                        </h1>
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
                            <div className="card border-blue-500">
                                <h3 className="text-2xl font-semibold text-white mb-4">Pro Monthly</h3>
                                <p className="text-5xl font-bold text-white mb-6">
                                    $15 <span className="text-lg font-normal text-gray-400">/ month</span>
                                </p>
                                <ul className="text-gray-300 mb-6 space-y-2">
                                    <li>• 150 credits per month</li>
                                    <li>• High-quality video generation</li>
                                    <li>• Priority processing</li>
                                    <li>• Email support</li>
                                </ul>
                                <button
                                    onClick={handleCheckout}
                                    disabled={isLoading || !paddle}
                                    className="btn-primary w-full"
                                >
                                    {isLoading ? 'Initializing...' : 'Subscribe Now'}
                                </button>
                            </div>
                            <div className="card">
                                <h3 className="text-2xl font-semibold text-white mb-4">Free Trial</h3>
                                <p className="text-5xl font-bold text-white mb-6">
                                    $0 <span className="text-lg font-normal text-gray-400">/ month</span>
                                </p>
                                <ul className="text-gray-300 mb-6 space-y-2">
                                    <li>• 10 credits per month</li>
                                    <li>• Standard quality</li>
                                    <li>• Community support</li>
                                </ul>
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