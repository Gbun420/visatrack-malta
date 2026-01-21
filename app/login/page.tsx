"use client";

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, ChevronLeft, Loader2 } from "lucide-react";
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center bg-primary overflow-hidden px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -ml-32 -mb-32" />
      </div>

      <div className="relative z-10 w-full max-w-[480px]">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-sm tracking-wide">
            <ChevronLeft className="w-4 h-4" />
            Return to Gateway
          </Link>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-[32px] overflow-hidden shadow-2xl"
        >
          <div className="bg-slate-50 border-b border-slate-100 p-8 text-center">
            <div className="mx-auto w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-premium mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight mb-2">Secure Access</h1>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.2em]">Authorized Personnel Only</p>
          </div>

          <div className="p-8 lg:p-10">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Identified Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@organization.mt"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-secondary/5 transition-all text-sm font-bold shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center pl-1">
                    <Label htmlFor="password" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Entry Key</Label>
                    <a href="#" className="text-[11px] font-bold text-secondary hover:text-primary transition-colors">Forgot Key?</a>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-secondary/5 transition-all text-sm font-bold shadow-inner"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-sm tracking-widest uppercase shadow-premium hover:shadow-premium-hover transition-all translate-y-0 hover:-translate-y-0.5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Validating...
                  </div>
                ) : "Verify Identity"}
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-50 text-center">
              <p className="text-sm font-medium text-slate-400">
                Unauthorized for access?{' '}
                <Link href="/register" className="font-bold text-secondary hover:underline underline-offset-4 decoration-2">
                  Register Enterprise Account
                </Link>
              </p>
            </div>

            {/* Demo Credentials - Only show in development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 rounded-2xl bg-amber-50 border border-amber-100/50">
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-2 text-center">Development Environment</p>
                <div className="flex justify-between items-center text-[11px] font-bold">
                  <span className="text-slate-400 uppercase tracking-tighter">Identity:</span>
                  <span className="text-amber-700">demo@visatrack.mt</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-bold mt-1">
                  <span className="text-slate-400 uppercase tracking-tighter">Key:</span>
                  <span className="text-amber-700">demo123</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em]">
            VisaTrack Malta • Enterprise-Grade Compliance
          </p>
        </motion.div>
      </div>
    </main>
  );
}
