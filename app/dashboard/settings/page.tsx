"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
    User,
    Building2,
    Bell,
    Shield,
    CreditCard,
    Users,
    Loader2,
    Save,
    Camera,
    CheckCircle2,
    ShieldCheck,
    Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
    { id: "profile", label: "Identity", icon: User },
    { id: "company", label: "Entity", icon: Building2 },
    { id: "notifications", label: "Alerts", icon: Bell },
    { id: "security", label: "Credential", icon: Shield },
    { id: "billing", label: "Subscription", icon: CreditCard },
    { id: "team", label: "Access Control", icon: Users },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSaving(false);
        toast({
            title: "Configuration Synchronized",
            description: "Your enterprise settings have been updated and secured.",
        });
    };

    return (
        <div className="space-y-10 pb-12">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] bg-secondary/10 px-2 py-1 rounded">System Configuration</span>
                </div>
                <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Enterprise Settings</h1>
                <p className="text-slate-500 mt-2 font-medium">Manage your corporate credentials, compliance alerts, and organizational access.</p>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <motion.div
                    className="w-full lg:w-72 flex-shrink-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="bg-white rounded-[32px] shadow-premium border border-slate-100 p-3 sticky top-28">
                        <div className="space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300",
                                        activeTab === tab.id
                                            ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-white" : "text-slate-400")} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Area */}
                <motion.div
                    className="flex-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="bg-white rounded-[40px] shadow-premium border border-slate-100 overflow-hidden">
                        <div className="p-8 lg:p-12">
                            {activeTab === "profile" && (
                                <div className="space-y-10">
                                    <SectionHeading
                                        title="Personnel Identity"
                                        subtitle="Update your administrative profile as an authorized officer."
                                    />

                                    <div className="flex flex-col sm:flex-row items-center gap-8 p-8 bg-slate-50 rounded-[32px]">
                                        <div className="relative group cursor-pointer">
                                            <div className="w-28 h-28 bg-primary rounded-[32px] shadow-premium flex items-center justify-center text-white text-3xl font-display font-bold">
                                                DU
                                            </div>
                                            <div className="absolute inset-0 bg-black/40 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Camera className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                        <div className="text-center sm:text-left space-y-3">
                                            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                                                <Button variant="outline" className="h-10 px-6 rounded-xl border-2 border-slate-200 font-bold hover:bg-white hover:border-secondary/30 hover:text-secondary transition-all">
                                                    Update Portrait
                                                </Button>
                                                <Button variant="ghost" className="h-10 px-6 font-bold text-red-500 hover:bg-red-50">Remove</Button>
                                            </div>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                                JPG, PNG or HEIC format.<br />Max resolution 2048px, Size 4MB.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-8">
                                        <InputField id="firstName" label="Identified First Name" defaultValue="Demo" />
                                        <InputField id="lastName" label="Identified Last Name" defaultValue="User" />
                                        <InputField id="email" label="Corporate Email" type="email" defaultValue="demo@visatrack.mt" />
                                        <InputField id="phone" label="Official Contact" type="tel" defaultValue="+356 9999 9999" />
                                    </div>

                                    <div className="pt-8 border-t border-slate-50 flex justify-end">
                                        <Button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="h-14 px-10 bg-primary text-white rounded-2xl font-bold text-sm tracking-widest uppercase shadow-premium hover:shadow-premium-hover transition-all hover:-translate-y-0.5"
                                        >
                                            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                            <Save className="w-4 h-4 mr-2" />
                                            Synchronize Identity
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {activeTab === "company" && (
                                <div className="space-y-10">
                                    <SectionHeading
                                        title="Legal Entity Information"
                                        subtitle="Authorized corporate details for the Maltese registry."
                                    />

                                    <div className="grid gap-8">
                                        <InputField id="companyName" label="Legal Entity Name" defaultValue="Malta TechCorp" />
                                        <InputField id="regNumber" label="Registry Identifier (MBR)" defaultValue="C99999" />

                                        <div className="grid sm:grid-cols-2 gap-8">
                                            <InputField id="city" label="Operational City" defaultValue="Valletta" />
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Operational Jurisdiction</Label>
                                                <div className="h-14 px-5 rounded-2xl bg-slate-50 flex items-center gap-3 border-2 border-transparent">
                                                    <Globe className="w-5 h-5 text-slate-300" />
                                                    <span className="text-sm font-bold text-slate-400">Malta (EU Primary)</span>
                                                </div>
                                            </div>
                                        </div>

                                        <InputField id="companyEmail" label="Official Correspondence Email" type="email" defaultValue="hr@maltatechcorp.com" />
                                    </div>

                                    <div className="pt-8 border-t border-slate-50 flex justify-end">
                                        <Button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="h-14 px-10 bg-primary text-white rounded-2xl font-bold text-sm tracking-widest uppercase shadow-premium hover:shadow-premium-hover transition-all hover:-translate-y-0.5"
                                        >
                                            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                            <Save className="w-4 h-4 mr-2" />
                                            Update Entity Data
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {activeTab === "notifications" && (
                                <div className="space-y-10">
                                    <SectionHeading
                                        title="Compliance Alert Logic"
                                        subtitle="Configure automated early warning systems for workforce documentation."
                                    />

                                    <div className="space-y-4">
                                        <NotificationToggle
                                            title="Visa Expiration Alerts"
                                            description="Automated triggers for upcoming visa expiries"
                                            defaultChecked={true}
                                        />
                                        <div className="ml-8 space-y-3 pt-2">
                                            <SubToggle title="90-Day Early Warning" defaultChecked={true} />
                                            <SubToggle title="60-Day Critical Alert" defaultChecked={true} />
                                            <SubToggle title="30-Day Terminal Warning" defaultChecked={true} />
                                        </div>
                                        <NotificationToggle
                                            title="Corporate Distribution"
                                            description="Broadcast alerts via registered corporate email"
                                            defaultChecked={true}
                                        />
                                        <NotificationToggle
                                            title="Executive Audit Logs"
                                            description="Weekly summary of all compliance activities"
                                            defaultChecked={false}
                                        />
                                    </div>

                                    <div className="pt-8 border-t border-slate-50 flex justify-end">
                                        <Button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="h-14 px-10 bg-primary text-white rounded-2xl font-bold text-sm tracking-widest uppercase shadow-premium hover:shadow-premium-hover transition-all hover:-translate-y-0.5"
                                        >
                                            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                            <Save className="w-4 h-4 mr-2" />
                                            Commit Alert Rules
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {activeTab === "security" && (
                                <div className="space-y-10">
                                    <SectionHeading
                                        title="Access Credentials"
                                        subtitle="Manage corporate authentication and security protocols."
                                    />

                                    <div className="grid gap-8 p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                                        <div className="space-y-6">
                                            <InputField id="currentPassword" label="Current Access Key" type="password" />
                                            <div className="grid sm:grid-cols-2 gap-8">
                                                <InputField id="newPassword" label="New Security Key" type="password" />
                                                <InputField id="confirmNewPassword" label="Confirm New Key" type="password" />
                                            </div>
                                        </div>
                                        <div className="p-4 bg-white/50 backdrop-blur-sm rounded-2xl flex gap-3 border border-slate-200/50">
                                            <ShieldCheck className="w-5 h-5 text-secondary flex-shrink-0" />
                                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed">
                                                System enforced requirements: Minimum 12 characters, including alphabetical, numeric, and symbolic identifiers.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-slate-50 flex justify-end">
                                        <Button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="h-14 px-10 bg-primary text-white rounded-2xl font-bold text-sm tracking-widest uppercase shadow-premium hover:shadow-premium-hover transition-all hover:-translate-y-0.5"
                                        >
                                            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                            Update Credentials
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {activeTab === "billing" && (
                                <div className="space-y-10">
                                    <SectionHeading
                                        title="Financial Subscription"
                                        subtitle="Manage your enterprise license and billing operations."
                                    />

                                    <div className="p-10 bg-primary rounded-[32px] text-white relative overflow-hidden shadow-2xl">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -mr-32 -mt-32" />
                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-8">
                                                <div>
                                                    <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] bg-white px-2 py-1 rounded inline-block mb-2">Licensed Tier</span>
                                                    <h3 className="text-3xl font-display font-bold">Enterprise Professional</h3>
                                                </div>
                                                <div className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-2xl border border-white/20 flex flex-col items-center">
                                                    <span className="text-2xl font-display font-bold">€99</span>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Per Month</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-4">
                                                <Button className="bg-white text-primary rounded-xl px-10 py-5 h-auto font-bold text-sm tracking-widest uppercase hover:bg-slate-50 transition-all hover:-translate-y-0.5">
                                                    Optimize License
                                                </Button>
                                                <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10 font-bold px-8">
                                                    Archive Plan
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <span className="w-2 h-2 bg-secondary rounded-full" />
                                            Payment Methodology
                                        </h3>
                                        <div className="p-6 border-2 border-slate-100 rounded-[28px] flex items-center justify-between group hover:border-secondary/20 transition-all cursor-pointer">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[10px] font-black italic tracking-tighter text-slate-300 border border-slate-100 uppercase">
                                                    VISA
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-slate-900 leading-none">Corporate Card •••• 4242</p>
                                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">Expires 12/28</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" className="rounded-xl font-bold text-secondary hover:bg-secondary/5">Modify</Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "team" && (
                                <div className="space-y-10">
                                    <SectionHeading
                                        title="Permission Infrastructure"
                                        subtitle="Regulate organizational access and delegated authorities."
                                    />

                                    <div className="flex justify-between items-center bg-slate-50 p-6 rounded-[28px] border border-slate-100">
                                        <div className="hidden sm:block">
                                            <p className="text-sm font-bold text-slate-900 leading-none mb-1">Delegate Access</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">3 active seats remaining</p>
                                        </div>
                                        <Button className="bg-primary text-white rounded-xl px-8 py-5 h-auto font-bold text-sm tracking-widest uppercase shadow-premium hover:shadow-premium-hover transition-all hover:-translate-y-0.5">
                                            <Users className="w-5 h-5 mr-3" />
                                            Invite Personnel
                                        </Button>
                                    </div>

                                    <div className="bg-white border-2 border-slate-50 rounded-[32px] overflow-hidden divide-y divide-slate-50">
                                        <TeamMember
                                            name="Executive User"
                                            email="demo@visatrack.mt"
                                            role="Admin"
                                            initials="EU"
                                        />
                                        <TeamMember
                                            name="Compliance Officer"
                                            email="jane@maltatechcorp.com"
                                            role="Editor"
                                            initials="CO"
                                        />
                                        <TeamMember
                                            name="Auditor General"
                                            email="bob@maltatechcorp.com"
                                            role="Viewer"
                                            initials="AG"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

// Helper Components
function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div className="space-y-2">
            <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">{title}</h2>
            <p className="text-slate-500 font-medium text-sm">{subtitle}</p>
        </div>
    );
}

function InputField({ id, label, type = "text", defaultValue = "" }: { id: string; label: string; type?: string; defaultValue?: string }) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">{label}</Label>
            <Input
                id={id}
                type={type}
                defaultValue={defaultValue}
                className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner focus:ring-4 focus:ring-secondary/5 transition-all font-bold text-sm text-slate-900"
            />
        </div>
    );
}

function NotificationToggle({
    title,
    description,
    defaultChecked,
}: {
    title: string;
    description: string;
    defaultChecked: boolean;
}) {
    const [checked, setChecked] = useState(defaultChecked);

    return (
        <div className="flex items-center justify-between p-6 bg-white border-2 border-slate-50 rounded-[28px] hover:border-secondary/20 transition-all">
            <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900 leading-none">{title}</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{description}</p>
            </div>
            <button
                aria-label={`Toggle ${title}`}
                onClick={() => setChecked(!checked)}
                className={cn(
                    "relative w-14 h-8 rounded-full transition-all duration-300",
                    checked ? "bg-secondary shadow-lg shadow-secondary/20" : "bg-slate-100"
                )}
            >
                <div
                    className={cn(
                        "absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300",
                        checked ? "translate-x-6" : "translate-x-0"
                    )}
                />
            </button>
        </div>
    );
}

function SubToggle({ title, defaultChecked }: { title: string; defaultChecked: boolean }) {
    const [checked, setChecked] = useState(defaultChecked);
    return (
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span className={cn("w-1.5 h-1.5 rounded-full", checked ? "bg-secondary" : "bg-slate-300")} />
                {title}
            </span>
            <button
                onClick={() => setChecked(!checked)}
                title={`Toggle ${title}`}
                aria-label={`Toggle ${title}`}
                className={cn(
                    "relative w-10 h-6 rounded-full transition-all",
                    checked ? "bg-slate-900" : "bg-slate-200"
                )}
            >
                <div className={cn("absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all", checked ? "translate-x-4" : "translate-x-0")} />
            </button>
        </div>
    );
}

function TeamMember({
    name,
    email,
    role,
    initials,
}: {
    name: string;
    email: string;
    role: string;
    initials: string;
}) {
    return (
        <div className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/5 group-hover:scale-105 transition-transform">
                    <span className="text-sm font-bold text-primary">{initials}</span>
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900 leading-none">{name}</p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">{email}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className={cn(
                    "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest",
                    role === "Admin" ? "bg-secondary/10 text-secondary" :
                        role === "Editor" ? "bg-primary/10 text-primary" :
                            "bg-slate-100 text-slate-500"
                )}>
                    {role}
                </div>
                <Button variant="ghost" className="h-10 px-4 rounded-xl font-bold text-slate-400 hover:text-slate-900 hover:bg-slate-100">Manage</Button>
            </div>
        </div>
    );
}
