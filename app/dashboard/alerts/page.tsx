"use client";

import { useState, useEffect } from "react";
import { format, parseISO, differenceInDays } from "date-fns";
import { ComplianceAlert } from "@/types";
import Link from "next/link";
import {
    Bell,
    AlertTriangle,
    Clock,
    FileX,
    CheckCircle,
    Filter,
    Loader2,
    Eye,
    Check,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AlertWithEmployee extends ComplianceAlert {
    employee?: {
        id: string;
        first_name: string;
        last_name: string;
    };
}

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<AlertWithEmployee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "open" | "acknowledged" | "resolved">("all");

    useEffect(() => {
        async function fetchAlerts() {
            try {
                const response = await fetch("/api/alerts");
                if (response.ok) {
                    const data = await response.json();
                    setAlerts(data);
                }
            } catch (error) {
                console.error("Failed to fetch alerts:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchAlerts();
    }, []);

    const updateAlertStatus = async (alertId: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/alerts/${alertId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                setAlerts((prev) =>
                    prev.map((a) => (a.id === alertId ? { ...a, status: newStatus as any } : a))
                );
            }
        } catch (error) {
            console.error("Failed to update alert:", error);
        }
    };

    const filteredAlerts = alerts.filter((alert) => {
        if (filter === "all") return true;
        return alert.status === filter;
    });

    const stats = {
        total: alerts.length,
        open: alerts.filter((a) => a.status === "open").length,
        acknowledged: alerts.filter((a) => a.status === "acknowledged").length,
        resolved: alerts.filter((a) => a.status === "resolved").length,
    };

    const getAlertIcon = (type: string) => {
        switch (type) {
            case "expiry":
                return Clock;
            case "missing_document":
                return FileX;
            case "status_change":
                return AlertTriangle;
            default:
                return Bell;
        }
    };

    const getAlertColor = (type: string, status: string) => {
        if (status === "resolved") return "bg-gray-50 border-gray-200";
        switch (type) {
            case "expiry":
                return "bg-amber-50 border-amber-200";
            case "missing_document":
                return "bg-red-50 border-red-200";
            default:
                return "bg-blue-50 border-blue-200";
        }
    };

    const getIconColor = (type: string, status: string) => {
        if (status === "resolved") return "text-gray-400 bg-gray-100";
        switch (type) {
            case "expiry":
                return "text-amber-600 bg-amber-100";
            case "missing_document":
                return "text-red-600 bg-red-100";
            default:
                return "text-blue-600 bg-blue-100";
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Compliance Alerts</h1>
                <p className="text-gray-500 mt-1">
                    Stay on top of visa expirations and compliance issues.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <button
                    onClick={() => setFilter("all")}
                    className={cn(
                        "p-4 rounded-xl border transition-all text-left",
                        filter === "all"
                            ? "bg-primary text-white border-primary shadow-lg"
                            : "bg-white border-gray-100 hover:border-gray-200"
                    )}
                >
                    <p className={cn("text-2xl font-bold", filter === "all" ? "text-white" : "text-gray-900")}>
                        {stats.total}
                    </p>
                    <p className={cn("text-sm", filter === "all" ? "text-white/80" : "text-gray-500")}>
                        Total Alerts
                    </p>
                </button>
                <button
                    onClick={() => setFilter("open")}
                    className={cn(
                        "p-4 rounded-xl border transition-all text-left",
                        filter === "open"
                            ? "bg-red-600 text-white border-red-600 shadow-lg"
                            : "bg-white border-gray-100 hover:border-gray-200"
                    )}
                >
                    <p className={cn("text-2xl font-bold", filter === "open" ? "text-white" : "text-red-600")}>
                        {stats.open}
                    </p>
                    <p className={cn("text-sm", filter === "open" ? "text-white/80" : "text-gray-500")}>
                        Open
                    </p>
                </button>
                <button
                    onClick={() => setFilter("acknowledged")}
                    className={cn(
                        "p-4 rounded-xl border transition-all text-left",
                        filter === "acknowledged"
                            ? "bg-amber-500 text-white border-amber-500 shadow-lg"
                            : "bg-white border-gray-100 hover:border-gray-200"
                    )}
                >
                    <p className={cn("text-2xl font-bold", filter === "acknowledged" ? "text-white" : "text-amber-500")}>
                        {stats.acknowledged}
                    </p>
                    <p className={cn("text-sm", filter === "acknowledged" ? "text-white/80" : "text-gray-500")}>
                        Acknowledged
                    </p>
                </button>
                <button
                    onClick={() => setFilter("resolved")}
                    className={cn(
                        "p-4 rounded-xl border transition-all text-left",
                        filter === "resolved"
                            ? "bg-green-600 text-white border-green-600 shadow-lg"
                            : "bg-white border-gray-100 hover:border-gray-200"
                    )}
                >
                    <p className={cn("text-2xl font-bold", filter === "resolved" ? "text-white" : "text-green-600")}>
                        {stats.resolved}
                    </p>
                    <p className={cn("text-sm", filter === "resolved" ? "text-white/80" : "text-gray-500")}>
                        Resolved
                    </p>
                </button>
            </div>

            {/* Alerts List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-16 flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-sm text-gray-500 mt-3">Loading alerts...</p>
                    </div>
                ) : filteredAlerts.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <p className="text-gray-900 font-medium">
                            {filter === "all" ? "No alerts" : `No ${filter} alerts`}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                            {filter === "all"
                                ? "Great job! Your workforce is fully compliant."
                                : "Try changing the filter to see other alerts."}
                        </p>
                    </div>
                ) : (
                    filteredAlerts.map((alert) => {
                        const Icon = getAlertIcon(alert.alert_type);

                        return (
                            <div
                                key={alert.id}
                                className={cn(
                                    "rounded-xl border p-5 transition-all hover:shadow-md",
                                    getAlertColor(alert.alert_type, alert.status)
                                )}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", getIconColor(alert.alert_type, alert.status))}>
                                        <Icon className="w-5 h-5" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className={cn(
                                                    "font-semibold",
                                                    alert.status === "resolved" ? "text-gray-500" : "text-gray-900"
                                                )}>
                                                    {alert.title}
                                                </h3>
                                                {alert.description && (
                                                    <p className={cn(
                                                        "text-sm mt-1",
                                                        alert.status === "resolved" ? "text-gray-400" : "text-gray-600"
                                                    )}>
                                                        {alert.description}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {alert.status === "open" && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => updateAlertStatus(alert.id, "acknowledged")}
                                                            className="text-xs"
                                                        >
                                                            <Eye className="w-3 h-3 mr-1" />
                                                            Acknowledge
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => updateAlertStatus(alert.id, "resolved")}
                                                            className="text-xs text-green-600 border-green-200 hover:bg-green-50"
                                                        >
                                                            <Check className="w-3 h-3 mr-1" />
                                                            Resolve
                                                        </Button>
                                                    </>
                                                )}
                                                {alert.status === "acknowledged" && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => updateAlertStatus(alert.id, "resolved")}
                                                        className="text-xs text-green-600 border-green-200 hover:bg-green-50"
                                                    >
                                                        <Check className="w-3 h-3 mr-1" />
                                                        Resolve
                                                    </Button>
                                                )}
                                                {alert.status === "resolved" && (
                                                    <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Resolved
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                            {alert.employee && (
                                                <Link
                                                    href={`/dashboard/employees/${alert.employee.id}`}
                                                    className="hover:text-primary hover:underline"
                                                >
                                                    {alert.employee.first_name} {alert.employee.last_name}
                                                </Link>
                                            )}
                                            {alert.due_date && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    Due: {format(parseISO(alert.due_date), "dd MMM yyyy")}
                                                </span>
                                            )}
                                            <span>
                                                Created: {format(parseISO(alert.created_at), "dd MMM yyyy")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
