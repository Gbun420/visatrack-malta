"use client";

import { Bell, Search, User, ChevronDown, Settings, Globe, LogOut } from "lucide-react";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export function DashboardHeader() {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const supabase = createClientComponentClient();
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <header className="sticky top-0 z-30 h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8">
            {/* Search */}
            <div className="flex items-center gap-4 flex-1 max-w-xl">
                <div className="relative w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-secondary transition-colors" />
                    <input
                        type="text"
                        placeholder="Quick search (e.g., employee name, passport #)..."
                        className="w-full pl-12 pr-4 py-3 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-secondary/5 focus:bg-white focus:border-secondary transition-all"
                    />
                </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-6">
                {/* Notifications */}
                <button aria-label="View notifications" className="relative p-2.5 rounded-xl hover:bg-slate-50 transition-all group">
                    <Bell className="w-5.5 h-5.5 text-slate-500 group-hover:text-primary transition-colors" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-white" />
                </button>

                {/* User Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-4 py-2 px-2 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-premium">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left hidden lg:block">
                                <p className="text-sm font-bold text-slate-900 leading-none mb-1">Demo User</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Malta TechCorp</p>
                            </div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>

                    {showUserMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowUserMenu(false)}
                            />
                            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-premium border border-slate-100 py-2 z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                                <a
                                    href="/dashboard/settings"
                                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                                >
                                    <Settings className="w-4 h-4" />
                                    Account Settings
                                </a>
                                <a
                                    href="#"
                                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                                >
                                    <Globe className="w-4 h-4" />
                                    Billing & Subscription
                                </a>
                                <hr className="my-2 border-slate-50" />
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-3 text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
