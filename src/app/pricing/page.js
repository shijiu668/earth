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
    const [customPriceId, setCustomPriceId] = useState('');
    const { user, profile, loading } = useAuth();

    const handlePaddleLoad = async () => {
        if (window.Paddle) {
            try {
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
                console.log('Paddle v2 initialized successfully!');

            } catch (error) {
                console.error('Error during initialization:', error);
                setIsLoading(false);
            }
        }
    };

    const testCheckout = (priceId) => {
        if (!user || !paddle) {
            alert('Please log in and wait for Paddle to initialize');
            return;
        }

        try {
            console.log('Testing checkout with Price ID:', priceId);

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
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to start checkout: ' + error.message);
        }
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
                onError={(e) => console.error('Failed to load Paddle script:', e)}
            />
            <main className="min-h-screen bg-black">
                <Header />
                <section className="section-padding">
                    <div className="container">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text text-center">
                            Paddle Price ID Tester
                        </h1>

                        {/* Status Display */}
                        <div className="mb-8 p-6 bg-gray-800 rounded-lg text-center max-w-2xl mx-auto">
                            <div className="text-white mb-4">System Status:</div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className={user ? 'text-green-400' : 'text-red-400'}>
                                    {user ? '✅' : '❌'} User: {user ? 'Logged in' : 'Not logged in'}
                                </div>
                                <div className={paddle ? 'text-green-400' : 'text-red-400'}>
                                    {paddle ? '✅' : '❌'} Paddle: {paddle ? 'Ready' : 'Not ready'}
                                </div>
                                <div className="col-span-2 text-blue-400">
                                    Environment: SANDBOX
                                </div>
                            </div>
                        </div>

                        {/* Custom Price ID Tester */}
                        <div className="mb-8 max-w-md mx-auto">
                            <div className="card">
                                <h3 className="text-xl font-semibold text-white mb-4">Test Custom Price ID</h3>
                                <input
                                    type="text"
                                    value={customPriceId}
                                    onChange={(e) => setCustomPriceId(e.target.value)}
                                    placeholder="Enter your Paddle Price ID (pri_01xxxxx)"
                                    className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 mb-4"
                                />
                                <button
                                    onClick={() => testCheckout(customPriceId)}
                                    disabled={!customPriceId || !paddle || !user}
                                    className="btn-primary w-full"
                                >
                                    Test This Price ID
                                </button>
                            </div>
                        </div>

                        {/* Default Price ID Test */}
                        <div className="max-w-md mx-auto">
                            <div className="card">
                                <h3 className="text-xl font-semibold text-white mb-4">Default Environment Price ID</h3>
                                <div className="text-gray-300 text-sm mb-4 break-all">
                                    Current: {monthlyPlanPriceId || 'Not set'}
                                </div>
                                <button
                                    onClick={() => testCheckout(monthlyPlanPriceId)}
                                    disabled={!monthlyPlanPriceId || !paddle || !user}
                                    className="btn-secondary w-full"
                                >
                                    Test Default Price ID
                                </button>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="mt-12 max-w-4xl mx-auto">
                            <div className="card">
                                <h3 className="text-2xl font-semibold text-white mb-4">How to Fix the Price ID Issue:</h3>
                                <ol className="text-gray-300 space-y-3">
                                    <li>1. Visit <a href="https://sandbox-vendors.paddle.com" target="_blank" className="text-blue-400 underline">Paddle Sandbox Console</a></li>
                                    <li>2. Go to <strong>Catalog → Products</strong></li>
                                    <li>3. Click <strong>"Create Product"</strong></li>
                                    <li>4. Create a product named "Pro Monthly Plan"</li>
                                    <li>5. Add a price: $15/month</li>
                                    <li>6. Copy the generated Price ID (starts with pri_01...)</li>
                                    <li>7. Test it using the custom Price ID field above</li>
                                    <li>8. If it works, update your Vercel environment variable</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
            </main>
        </>
    );
}