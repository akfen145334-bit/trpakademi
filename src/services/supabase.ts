import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase yalnızca ortam değişkenleri tanımlıysa etkinleşir:
 *   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
 * Tanımlı değilse uygulama bugünkü gibi hesapsız (yerel kayıt) çalışır, giriş düğmeleri gizlenir.
 * (anon key tarayıcıya açık olacak şekilde tasarlanmıştır; güvenlik RLS kurallarıyla sağlanır.)
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseEnabled = Boolean(url && key);

export const supabase: SupabaseClient | null = supabaseEnabled
  ? createClient(url as string, key as string, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    })
  : null;
