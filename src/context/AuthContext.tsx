import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, supabaseEnabled } from '../services/supabase';
import { Tier } from '../config/plans';

interface AuthValue {
  /** Supabase ayarlıysa true; değilse hesap özellikleri gizlenir */
  enabled: boolean;
  user: User | null;
  tier: Tier;
  loading: boolean;
  sendMagicLink: (email: string) => Promise<{ ok: boolean; error?: string }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [premium, setPremium] = useState(false);
  const [loading, setLoading] = useState(supabaseEnabled);

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Premium bilgisi: profiles.premium_until (sunucuda ödeme sonrası yazılır; tarayıcı yazamaz)
  useEffect(() => {
    if (!supabase || !user) {
      setPremium(false);
      return;
    }
    let alive = true;
    supabase
      .from('profiles')
      .select('premium_until')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!alive) return;
        const until = data?.premium_until ? new Date(data.premium_until).getTime() : 0;
        setPremium(until > Date.now());
      });
    return () => {
      alive = false;
    };
  }, [user]);

  const sendMagicLink = useCallback(async (email: string) => {
    if (!supabase) return { ok: false, error: 'Hesap sistemi etkin değil' };
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + window.location.pathname }
    });
    return error ? { ok: false, error: error.message } : { ok: true };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + window.location.pathname }
    });
  }, []);

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
  }, []);

  const tier: Tier = !user ? 'anon' : premium ? 'premium' : 'member';

  return (
    <Ctx.Provider
      value={{ enabled: supabaseEnabled, user, tier, loading, sendMagicLink, signInWithGoogle, signOut }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = (): AuthValue => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used inside AuthProvider');
  return v;
};
