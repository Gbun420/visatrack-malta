"use client";

import { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "company", label: "Company", icon: Building2 },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "team", label: "Team", icon: Users },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate save
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSaving(false);
        toast({
            title: "Settings saved",
            description: "Your changes have been saved successfully.",
        });
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your account and preferences.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    activeTab === tab.id
                                        ? "bg-primary text-white"
                                        : "text-gray-600 hover:bg-gray-50"
                                )}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        {activeTab === "profile" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Profile</h2>
                                    <p className="text-sm text-gray-500">
                                        Update your personal information.
                                    </p>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                        DU
                                    </div>
                                    <div>
                                        <Button variant="outline" size="sm">
                                            Change Avatar
                                        </Button>
                                        <p className="text-xs text-gray-500 mt-1">
                                            JPG, PNG or GIF. Max 2MB.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            defaultValue="Demo"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            defaultValue="User"
                                            className="mt-1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        defaultValue="demo@visatrack.mt"
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+356 9999 9999"
                                        className="mt-1"
                                    />
                                </div>

                                <div className="pt-4 border-t flex justify-end">
                                    <Button onClick={handleSave} disabled={isSaving}>
                                        {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === "company" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Company</h2>
                                    <p className="text-sm text-gray-500">
                                        Manage your company information.
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="companyName">Company Name</Label>
                                    <Input
                                        id="companyName"
                                        defaultValue="Malta TechCorp"
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="regNumber">Registration Number</Label>
                                    <Input
                                        id="regNumber"
                                        defaultValue="C99999"
                                        className="mt-1"
                                    />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            defaultValue="Valletta"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="country">Country</Label>
                                        <Input
                                            id="country"
                                            defaultValue="Malta"
                                            disabled
                                            className="mt-1 bg-gray-50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="companyEmail">Company Email</Label>
                                    <Input
                                        id="companyEmail"
                                        type="email"
                                        defaultValue="hr@maltatechcorp.com"
                                        className="mt-1"
                                    />
                                </div>

                                <div className="pt-4 border-t flex justify-end">
                                    <Button onClick={handleSave} disabled={isSaving}>
                                        {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === "notifications" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                        Notifications
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Configure how you receive alerts and updates.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <NotificationToggle
                                        title="Visa Expiry Alerts"
                                        description="Receive notifications when visas are expiring"
                                        defaultChecked={true}
                                    />
                                    <NotificationToggle
                                        title="90-Day Warning"
                                        description="Alert me 90 days before visa expiry"
                                        defaultChecked={true}
                                    />
                                    <NotificationToggle
                                        title="60-Day Warning"
                                        description="Alert me 60 days before visa expiry"
                                        defaultChecked={true}
                                    />
                                    <NotificationToggle
                                        title="30-Day Warning"
                                        description="Alert me 30 days before visa expiry"
                                        defaultChecked={true}
                                    />
                                    <NotificationToggle
                                        title="Email Notifications"
                                        description="Send alerts to my email"
                                        defaultChecked={true}
                                    />
                                    <NotificationToggle
                                        title="Weekly Summary"
                                        description="Receive a weekly compliance summary"
                                        defaultChecked={false}
                                    />
                                </div>

                                <div className="pt-4 border-t flex justify-end">
                                    <Button onClick={handleSave} disabled={isSaving}>
                                        {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Security</h2>
                                    <p className="text-sm text-gray-500">
                                        Manage your password and security settings.
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <Input
                                        id="currentPassword"
                                        type="password"
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                                    <Input
                                        id="confirmNewPassword"
                                        type="password"
                                        className="mt-1"
                                    />
                                </div>

                                <div className="pt-4 border-t flex justify-end">
                                    <Button onClick={handleSave} disabled={isSaving}>
                                        {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        Update Password
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === "billing" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Billing</h2>
                                    <p className="text-sm text-gray-500">
                                        Manage your subscription and payment methods.
                                    </p>
                                </div>

                                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="font-semibold text-gray-900">Professional Plan</p>
                                            <p className="text-sm text-gray-500">€99/month</p>
                                        </div>
                                        <span className="px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
                                            Active
                                        </span>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button variant="outline" size="sm">
                                            Change Plan
                                        </Button>
                                        <Button variant="outline" size="sm" className="text-red-600">
                                            Cancel Subscription
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-900 mb-3">Payment Method</h3>
                                    <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">
                                                VISA
                                            </div>
                                            <span className="text-sm">•••• •••• •••• 4242</span>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            Edit
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "team" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Team</h2>
                                    <p className="text-sm text-gray-500">
                                        Manage team members and their permissions.
                                    </p>
                                </div>

                                <div className="flex justify-end">
                                    <Button>
                                        <Users className="w-4 h-4 mr-2" />
                                        Invite Member
                                    </Button>
                                </div>

                                <div className="border border-gray-200 rounded-lg divide-y">
                                    <TeamMember
                                        name="Demo User"
                                        email="demo@visatrack.mt"
                                        role="Admin"
                                        initials="DU"
                                    />
                                    <TeamMember
                                        name="Jane Smith"
                                        email="jane@maltatechcorp.com"
                                        role="Editor"
                                        initials="JS"
                                    />
                                    <TeamMember
                                        name="Bob Johnson"
                                        email="bob@maltatechcorp.com"
                                        role="Viewer"
                                        initials="BJ"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
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
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
                <p className="font-medium text-gray-900">{title}</p>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
            <button
                aria-label={`Toggle ${title}`}
                onClick={() => setChecked(!checked)}
                className={cn(
                    "relative w-11 h-6 rounded-full transition-colors",
                    checked ? "bg-primary" : "bg-gray-200"
                )}
            >
                <span
                    className={cn(
                        "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform",
                        checked && "translate-x-5"
                    )}
                />
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
        <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">{initials}</span>
                </div>
                <div>
                    <p className="font-medium text-gray-900">{name}</p>
                    <p className="text-sm text-gray-500">{email}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span
                    className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        role === "Admin"
                            ? "bg-primary/10 text-primary"
                            : role === "Editor"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-600"
                    )}
                >
                    {role}
                </span>
                <Button variant="ghost" size="sm">
                    Edit
                </Button>
            </div>
        </div>
    );
}
