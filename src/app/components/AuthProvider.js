'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
// 不再需要 useRouter
// import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    // 不再需要 router
    // const router = useRouter(); 

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        };

        getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);

            // 移除这个判断逻辑
            // if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
            //   router.refresh();
            // }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []); // 从依赖项数组中移除 router

    const value = {
        session,
        user,
        profile,
        loading,
        signOut: () => supabase.auth.signOut(),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};