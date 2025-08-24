// app/pricing/page.tsx
'use client';
import { CheckCircle, Star, AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PricingPage() {
    const { user, profile, updateProfile } = useAuth();
    const [isLoading, setIsLoading] = useState(null); // String to track loading state for each button
    const [isCancelling, setIsCancelling] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    // 新增：判断用户的当前计划
    const currentPlan = profile?.subscription_plan;
    const subscriptionStatus = profile?.stripe_subscription_status;
    const isSubscriptionCancelling = subscriptionStatus === 'cancel_at_period_end';
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

    const handleCancelSubscription = async () => {
        setIsCancelling(true);

        try {
            const response = await fetch('/api/cancel-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error || 'Failed to cancel subscription.');
            }

            const data = await response.json();

            // 更新本地状态
            updateProfile({ stripe_subscription_status: 'cancel_at_period_end' });

            alert('Your subscription has been cancelled. You can continue using your remaining credits until the end of the current billing period.');
            setShowCancelModal(false);

        } catch (error) {
            console.error('Cancel subscription error:', error);
            alert(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred.'}`);
        } finally {
            setIsCancelling(false);
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


                    {/* 订阅状态提示 */}
                    {user && currentPlan && currentPlan !== 'free' && (
                        <div className="max-w-4xl mx-auto mt-8">
                            {isSubscriptionCancelling ? (
                                <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4 flex items-center">
                                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
                                    <div className="text-yellow-200">
                                        <p className="font-semibold">Subscription Cancellation Scheduled</p>
                                        <p className="text-sm">Your subscription will end at the end of the current billing period. You can continue using your remaining credits until then.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-green-900/20 border border-green-500 rounded-lg p-4 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                                        <div className="text-green-200">
                                            <p className="font-semibold">Active Subscription</p>
                                            <p className="text-sm">You're currently on the {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} plan with {profile?.credits || 0} credits remaining.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowCancelModal(true)}
                                        className="text-red-400 hover:text-red-300 text-sm underline transition-colors"
                                    >
                                        Cancel Subscription
                                    </button>
                                </div>
                            )}
                        </div>
                    )}


                    {/* 修改为并排展示两个计划 */}
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16 items-start">
                        {plans.map((plan) => {
                            const isCurrentPlan = currentPlan === plan.name.toLowerCase();
                            // Pro 用户不能订阅 Basic 计划
                            const isDisabled = isLoading || isCurrentPlan || (currentPlan === 'pro' && plan.name === 'Basic') || isSubscriptionCancelling;

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
            {/* 取消订阅确认模态框 */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
                    <div className="relative bg-gray-900 rounded-lg p-8 w-full max-w-md">
                        <button
                            onClick={() => setShowCancelModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <div className="text-center">
                            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-4">Cancel Subscription?</h2>
                            <p className="text-gray-300 mb-6">
                                Your subscription will be cancelled at the end of the current billing period.
                                You'll keep access to your remaining credits until then.
                            </p>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="flex-1 btn-secondary"
                                >
                                    Keep Subscription
                                </button>
                                <button
                                    onClick={handleCancelSubscription}
                                    disabled={isCancelling}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 disabled:opacity-50"
                                >
                                    {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </main>
    );
}