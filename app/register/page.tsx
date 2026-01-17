"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, CheckCircle2, Loader2, ChevronLeft } from "lucide-react";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const router = useRouter();
    const supabase = createClientComponentClient();
    const { toast } = useToast();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                variant: "destructive",
                title: "Validation Error",
                description: "Password confirmation does not match.",
            });
            return;
        }

        if (!acceptTerms) {
            toast({
                variant: "destructive",
                title: "Requirement Missing",
                description: "You must accept the terms of service to proceed.",
            });
            return;
        }

        setIsLoading(true);

        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        company_name: companyName,
                    },
                },
            });

            if (authError) throw authError;

            toast({
                title: "Provisioning Complete",
                description: "Please verify your corporate identity via the email sent.",
            });

            router.push("/login");
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen relative flex items-center justify-center bg-primary overflow-hidden px-4 py-12">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[120px] -ml-64 -mt-64" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -mr-32 -mb-32" />
            </div>

            <div className="relative z-10 w-full max-w-[560px]">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <Link href="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-sm tracking-wide">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Login
                    </Link>
                </motion.div>

                {/* Registration Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-white rounded-[40px] overflow-hidden shadow-2xl"
                >
                    <div className="bg-slate-50 border-b border-slate-100 p-10 text-center">
                        <div className="mx-auto w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-premium mb-6">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight mb-2">Establish Enterprise Account</h1>
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.2em]">Malta TCN Compliance Framework</p>
                    </div>

                    <div className="p-10">
                        <form onSubmit={handleRegister} className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        type="text"
                                        placeholder="Authorized Officer"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                        className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-secondary/5 transition-all text-sm font-bold shadow-inner"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="companyName" className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Legal Entity</Label>
                                    <Input
                                        id="companyName"
                                        type="text"
                                        placeholder="Organization Name"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        required
                                        className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-secondary/5 transition-all text-sm font-bold shadow-inner"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Corporate Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="officer@organization.mt"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-secondary/5 transition-all text-sm font-bold shadow-inner"
                                />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Security Key</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-secondary/5 transition-all text-sm font-bold shadow-inner"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Confirm Key</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-secondary/5 transition-all text-sm font-bold shadow-inner"
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                    className="mt-1 h-5 w-5 rounded-lg border-slate-200 text-secondary focus:ring-secondary transition-all"
                                />
                                <label htmlFor="terms" className="text-xs font-medium text-slate-500 leading-relaxed">
                                    I certify that I am authorized to register on behalf of the stated legal entity and agree to the{" "}
                                    <a href="#" className="text-secondary font-bold hover:underline">Compliance Standards</a> and <a href="#" className="text-secondary font-bold hover:underline">Data Protection Policy</a>.
                                </label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-16 bg-primary text-white rounded-2xl font-bold text-sm tracking-widest uppercase shadow-premium hover:shadow-premium-hover transition-all translate-y-0 hover:-translate-y-0.5"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Provisioning...
                                    </div>
                                ) : "Initialize Enterprise Account"}
                            </Button>
                        </form>
                    </div>
                </motion.div>

                {/* Benefits / Social Proof */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-10 grid sm:grid-cols-3 gap-6"
                >
                    <Benefit icon={CheckCircle2} label="Real-time Alerts" />
                    <Benefit icon={Shield} label="GDPR Compliant" />
                    <Benefit icon={CheckCircle2} label="Instant Audits" />
                </motion.div>
            </div>
        </main>
    );
}

function Benefit({ icon: Icon, label }: { icon: any, label: string }) {
    return (
        <div className="flex items-center justify-center gap-2 text-slate-400">
            <Icon className="w-4 h-4 text-secondary" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
        </div>
    );
}
