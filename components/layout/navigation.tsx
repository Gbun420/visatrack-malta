"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#contact", label: "Contact" },
];

export function Navigation() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-premium group-hover:shadow-premium-hover transition-all duration-300">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-display font-bold text-primary tracking-tight">
                            VisaTrack<span className="text-secondary">Malta</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/login"
                            className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors px-4 py-2"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/register"
                            className="text-sm font-semibold text-white bg-primary px-6 py-3 rounded-xl hover:bg-slate-800 shadow-premium hover:shadow-premium-hover transition-all duration-300 hover:-translate-y-0.5"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-gray-600 hover:text-primary transition-colors"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={cn(
                    "md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-100 transition-all duration-300 ease-in-out",
                    mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                )}
            >
                <div className="px-4 py-4 space-y-3">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-sm font-medium text-gray-600 hover:text-primary transition-colors py-2"
                        >
                            {link.label}
                        </a>
                    ))}
                    <div className="pt-4 border-t border-gray-100 space-y-2">
                        <Link
                            href="/login"
                            className="block text-center text-sm font-medium text-gray-700 py-2.5 border border-gray-200 rounded-lg hover:border-primary hover:text-primary transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/register"
                            className="block text-center text-sm font-medium text-white bg-gradient-to-r from-primary to-teal-600 py-2.5 rounded-lg"
                        >
                            Get Started Free
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
