'use client';

import { Auth } from '@supabase/auth-ui-react';
// 移除这一行，我们不再使用 ThemeSupa
// import { ThemeSupa } from '@supabase/auth-ui-react'; 
import { supabase } from '../../lib/supabaseClient';
import { X } from 'lucide-react';

export default function LoginModal({ onClose }) {
    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
            <div className="relative bg-gray-900 rounded-lg p-8 w-full max-w-md">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <X className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold text-center mb-6 text-white">Login or Sign Up</h2>
                <Auth
                    supabaseClient={supabase}
                    // 移除 appearance 属性，直接使用内置主题
                    // appearance={{ theme: ThemeSupa }}
                    theme="dark" // 保留这一行，它会启用内置的深色主题
                    providers={['google', 'github']}
                    socialLayout="horizontal"
                />
            </div>
        </div>
    );
}