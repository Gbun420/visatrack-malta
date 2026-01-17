"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    FileText,
    Bell,
    Settings,
    ChevronLeft,
    ChevronRight,
    Shield,
    LogOut,
    HelpCircle,
} from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

const mainNavItems = [
    {
        href: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
    },
    {
        href: "/dashboard/employees",
        label: "Employees",
        icon: Users,
    },
    {
        href: "/dashboard/visas",
        label: "Visas",
        icon: FileText,
    },
    {
        href: "/dashboard/alerts",
        label: "Alerts",
        icon: Bell,
    },
];

const bottomNavItems = [
    {
        href: "/dashboard/settings",
        label: "Settings",
        icon: Settings,
    },
    {
        href: "#",
        label: "Help Center",
        icon: HelpCircle,
    },
];

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClientComponentClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    const isActive = (href: string) => {
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }
        return pathname.startsWith(href);
    };

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen bg-primary text-white transition-all duration-300 flex flex-col shadow-2xl",
                collapsed ? "w-20" : "w-64"
            )}
        >
            {/* Logo */}
            <div className="flex items-center justify-between h-20 px-6 border-b border-white/5">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    {!collapsed && (
                        <span className="text-xl font-display font-bold tracking-tight text-white">
                            VisaTrack<span className="text-secondary">Malta</span>
                        </span>
                    )}
                </Link>
                {!collapsed && (
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        title="Collapse Sidebar"
                        className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-white"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 py-8 px-4 space-y-2">
                {mainNavItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative",
                            isActive(item.href)
                                ? "bg-secondary text-white shadow-premium"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                        )}
                    >
                        <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive(item.href) && "text-white")} />
                        {!collapsed && <span className="font-semibold text-sm tracking-wide">{item.label}</span>}
                        {collapsed && (
                            <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-premium border border-white/10">
                                {item.label}
                            </div>
                        )}
                    </Link>
                ))}
            </nav>

            {/* Bottom Navigation */}
            <div className="py-6 px-4 border-t border-white/5 space-y-2">
                {bottomNavItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative",
                            isActive(item.href)
                                ? "bg-white/10 text-white"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                        )}
                    >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && <span className="font-semibold text-sm tracking-wide">{item.label}</span>}
                        {collapsed && (
                            <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-premium border border-white/10">
                                {item.label}
                            </div>
                        )}
                    </Link>
                ))}

                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-400 hover:bg-red-500/10 hover:text-red-400 group relative"
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="font-semibold text-sm tracking-wide">Sign Out</span>}
                    {collapsed && (
                        <div className="absolute left-full ml-4 px-3 py-2 bg-red-600 text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                            Sign Out
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
}
