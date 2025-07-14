// lib/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js';

// 警告: 只能在安全的服务器环境中使用此客户端
// 不要将 SERVICE_ROLE_KEY 暴露给前端
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 确保你在 Supabase > Project Settings > API 中获取并设置了这个环境变量
);