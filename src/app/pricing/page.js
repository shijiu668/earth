'use client';

import { useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import Header from '../components/Header';
import Footer from '../components/Footer';

// 在文件顶部引入 Paddle.js hook
const usePaddle = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
        script.async = true;
        script.onload = () => {
            if (process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN) {
                window.Paddle.Setup({
                    token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
                });
                console.log('Paddle v2 initialized successfully!');
            } else {
                console.error('Paddle client token is not configured.');
            }
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);
};

export default function PricingPage() {
    const { user } = useAuth();
    usePaddle(); // 初始化 Paddle.js

    const handleCheckout = () => {
        if (!user) {
            alert('Please log in to subscribe.');
            return;
        }

        if (!window.Paddle) {
            console.error('Paddle.js is not loaded yet.');
            return;
        }

        const priceId = process.env.NEXT_PUBLIC_PADDLE_PRO_MONTHLY_PRICE_ID;
        console.log(`Testing checkout with Price ID: ${priceId}`);

        // 🚀 **诊断日志和解决方案**
        // 我们将所有要发送的数据组合成一个对象，以便清晰地记录和检查
        const checkoutData = {
            items: [{ priceId: priceId, quantity: 1 }],
            customer: { email: user.email },
            // ✅ **核心修正**：确保 customData 是一个原生JavaScript对象，而不是JSON字符串
            customData: {
                user_id: user.id
            }
        };

        // 在调用前打印最终数据结构
        console.log('--- Opening Paddle Checkout with the following data: ---');
        console.dir(checkoutData); // 使用 console.dir 方便查看对象结构
        console.log('Type of customData:', typeof checkoutData.customData); // 验证 customData 类型
        console.log('----------------------------------------------------');


        window.Paddle.Checkout.open(checkoutData);
    };

    return (
        <div className="min-h-screen bg-black flex flex-col">
            <Header />
            <main className="flex-grow section-padding container">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">Pricing</h1>
                    <p className="text-xl text-gray-300">Choose the plan that's right for you.</p>
                </div>

                <div className="max-w-md mx-auto card">
                    <h2 className="text-3xl font-bold text-white mb-2">Pro Plan</h2>
                    <p className="text-gray-400 mb-6">Unlock all premium features.</p>
                    <div className="text-5xl font-extrabold text-white mb-6">
                        $15 <span className="text-xl font-medium text-gray-400">/ month</span>
                    </div>
                    <ul className="space-y-4 text-gray-300 mb-8">
                        <li className="flex items-center">✓ 150 generation credits per month</li>
                        <li className="flex items-center">✓ High-resolution video exports</li>
                        <li className="flex items-center">✓ No watermarks</li>
                        <li className="flex items-center">✓ Priority support</li>
                    </ul>
                    <button
                        onClick={handleCheckout}
                        className="w-full btn-primary text-lg"
                        disabled={!user}
                    >
                        {user ? 'Subscribe Now' : 'Log in to Subscribe'}
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
}