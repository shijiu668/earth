'use client';

import { Auth } from '@supabase/auth-ui-react';
// 我们不再需要 ThemeSupa，所以这个导入可以删掉
import { supabase } from '../../lib/supabaseClient';
import { X } from 'lucide-react';

// 自定义样式对象
const customTheme = {
    default: {
        colors: {
            brand: 'rgb(37 99 235)', // 蓝色
            brandAccent: 'rgb(59 130 246)',
            brandButtonText: 'white',
            defaultButtonBackground: 'white',
            defaultButtonBackgroundHover: '#eaeaea',
            defaultButtonBorder: 'lightgray',
            defaultButtonText: 'gray',
            dividerBackground: '#404040',
            inputBackground: '#262626',
            inputBorder: '#525252',
            inputBorderHover: '#737373',
            inputBorderFocus: 'rgb(37 99 235)',
            inputText: 'white',
            inputLabelText: '#a3a3a3',
            inputPlaceholder: '#737373',
            messageText: '#d4d4d4',
            messageTextDanger: 'rgb(239 68 68)',
            anchorTextColor: '#d4d4d4',
            anchorTextColorHover: 'rgb(59 130 246)',
        },
        space: {
            spaceSmall: '4px',
            spaceMedium: '8px',
            spaceLarge: '16px',
            labelBottomMargin: '8px',
            anchorBottomMargin: '4px',
            emailInputSpacing: '4px',
            socialAuthSpacing: '8px',
            buttonPadding: '10px 15px',
            inputPadding: '10px 15px',
        },
        fonts: {
            bodyFontFamily: `inherit`, // 继承网站字体
            buttonFontFamily: `inherit`,
            labelFontFamily: `inherit`,
            inputFontFamily: `inherit`,
        },
        borderWidths: {
            buttonBorderWidth: '1px',
            inputBorderWidth: '1px',
        },
        radii: {
            borderRadiusButton: '8px', // 圆角
            inputBorderRadius: '8px',
        },
    },
};

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
                    // 使用我们上面定义的自定义样式
                    appearance={{
                        variables: customTheme,
                    }}
                    // 我们不再需要 theme="dark" 这个属性了
                    providers={['google', 'github']}
                    socialLayout="horizontal"
                />
            </div>
        </div>
    );
}