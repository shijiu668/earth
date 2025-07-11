// lib/supabaseClient.js
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// 注意：这里我们不再直接创建客户端，而是导出一个可以在任何客户端组件中使用的函数或单例
// 为了简单起见，我们导出一个单例。
// 这个客户端实例是专门为浏览器环境（客户端组件）设计的。
export const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
})