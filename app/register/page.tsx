"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, CheckCircle2, Loader2 } from "lucide-react";

export default function RegisterPage() {
    const [step, setStep] = useState(1);
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
                title: "Passwords don't match",
                description: "Please make sure your passwords match.",
            });
            return;
        }

        if (!acceptTerms) {
            toast({
                variant: "destructive",
                title: "Terms Required",
                description: "Please accept the terms and conditions.",
            });
            return;
        }

        setIsLoading(true);

        try {
            // Create user account
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

            // Show success message
            toast({
                title: "Account created!",
                description: "Please check your email to verify your account.",
            });

            // Redirect to login
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
        <div className="min-h-screen flex">
            {/* Left side - Form */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <Link href="/" className="inline-flex items-center gap-2 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-teal-500 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-teal-500 bg-clip-text text-transparent">
                            VisaTrack
                        </span>
                    </Link>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Create your account
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Start your 14-day free trial. No credit card required.
                    </p>

                    <form onSubmit={handleRegister} className="space-y-5">
                        {/* Full Name */}
                        <div>
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="mt-1"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <Label htmlFor="email">Work Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1"
                            />
                        </div>

                        {/* Company Name */}
                        <div>
                            <Label htmlFor="companyName">Company Name</Label>
                            <Input
                                id="companyName"
                                type="text"
                                placeholder="Acme Corporation"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                required
                                className="mt-1"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                                className="mt-1"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Must be at least 8 characters
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="mt-1"
                            />
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={acceptTerms}
                                onChange={(e) => setAcceptTerms(e.target.checked)}
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor="terms" className="text-sm text-gray-600">
                                I agree to the{" "}
                                <a href="#" className="text-primary hover:underline">
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a href="#" className="text-primary hover:underline">
                                    Privacy Policy
                                </a>
                            </label>
                        </div>

                        {/* Submit */}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Create Account
                        </Button>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-6">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right side - Benefits */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-teal-600 p-12 items-center justify-center">
                <div className="max-w-md text-white">
                    <h2 className="text-3xl font-bold mb-6">
                        Join 500+ Maltese employers managing TCN compliance
                    </h2>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Automated Tracking</h3>
                                <p className="text-white/80 text-sm">
                                    Never miss a visa expiry date with smart alerts at 90, 60, and 30 days.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Compliance Dashboard</h3>
                                <p className="text-white/80 text-sm">
                                    Real-time visibility into your workforce&apos;s documentation status.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Secure & GDPR Compliant</h3>
                                <p className="text-white/80 text-sm">
                                    Enterprise-grade security with full data protection compliance.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-white/10 rounded-xl backdrop-blur-sm">
                        <p className="text-white/90 italic mb-4">
                            &quot;VisaTrack has reduced our compliance incidents by 95%. It&apos;s an essential tool for any Maltese employer with TCN workers.&quot;
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-semibold">
                                MB
                            </div>
                            <div>
                                <p className="font-semibold">Maria Borg</p>
                                <p className="text-white/70 text-sm">HR Director, Malta Gaming Authority</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
