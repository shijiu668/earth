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
            // =================================================================
            // 关键调试日志 (Key Debugging Logs)
            // =================================================================
            console.log('1. Raw window.Paddle object:', window.Paddle);
            console.log('2. Type of window.Paddle:', typeof window.Paddle);

            if (typeof window.Paddle === 'object' && window.Paddle !== null) {
                console.log('3. Available keys on window.Paddle:', Object.keys(window.Paddle));
            }
            // =================================================================

            // 尝试执行我们认为应该存在的函数
            try {
                console.log('4. Attempting to call Paddle.Create()...');
                const paddleInstance = await window.Paddle.Create({
                    token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
                    environment: 'sandbox',
                    settings: {
                        displayMode: 'overlay',
                        eventCallback: (data) => {
                            if (data.name === 'checkout.completed') {
                                alert('Subscription successful! Your credits will be updated shortly.');
                                window.location.href = '/';
                            }
                        },
                    },
                });

                setPaddle(paddleInstance);
                setIsLoading(false);
                console.log('5. Paddle initialized successfully!');

            } catch (error) {
                console.error('6. Error during initialization:', error);
                alert('A critical error occurred with the payment system. Please contact support');
                setIsLoading(false);
            }

        } else {
            console.error('Error: window.Paddle object not found after script load.');
        }
        console.log('===== Paddle Debug End =====');
    };

    const handleCheckout = () => {
        // ... checkout logic remains the same
        if (!user) {
            alert('Please log in before subscribing.');
            return;
        }
        if (!paddle) {
            alert('Payment system is not ready. Please refresh.');
            return;
        }
        paddle.Checkout.open({
            items: [{ priceId: monthlyPlanPriceId, quantity: 1 }],
            customer: { email: user.email, },
            customData: { user_id: user.id }
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