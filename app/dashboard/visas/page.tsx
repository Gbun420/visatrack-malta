"use client";

import { useState, useEffect } from "react";
import { format, parseISO, differenceInDays } from "date-fns";
import { Visa } from "@/types";
import { VisaStatusBadge } from "@/components/employees/status-badge";
import {
    FileText,
    Search,
    Filter,
    Plus,
    Calendar,
    User,
    Loader2,
    AlertCircle,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";

interface VisaWithEmployee extends Visa {
    employee?: {
        id: string;
        first_name: string;
        last_name: string;
        passport_number: string;
    };
}

export default function VisasPage() {
    const [visas, setVisas] = useState<VisaWithEmployee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<"all" | "expiring" | "expired" | "valid">("all");

    useEffect(() => {
        async function fetchVisas() {
            try {
                const response = await fetch("/api/visas");
                if (response.ok) {
                    const data = await response.json();
                    setVisas(data);
                }
            } catch (error) {
                console.error("Failed to fetch visas:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchVisas();
    }, []);

    const filteredVisas = visas.filter((visa) => {
        const daysUntilExpiry = differenceInDays(parseISO(visa.expiry_date), new Date());

        // Apply status filter
        if (filter === "expired" && daysUntilExpiry >= 0) return false;
        if (filter === "expiring" && (daysUntilExpiry < 0 || daysUntilExpiry >= 90)) return false;
        if (filter === "valid" && daysUntilExpiry < 90) return false;

        // Apply search filter
        if (searchQuery) {
            const search = searchQuery.toLowerCase();
            const employeeName = `${visa.employee?.first_name} ${visa.employee?.last_name}`.toLowerCase();
            const passport = visa.employee?.passport_number?.toLowerCase() || "";
            const permitNumber = visa.permit_number?.toLowerCase() || "";

            return employeeName.includes(search) || passport.includes(search) || permitNumber.includes(search);
        }

        return true;
    });

    const stats = {
        total: visas.length,
        valid: visas.filter((v) => differenceInDays(parseISO(v.expiry_date), new Date()) >= 90).length,
        expiring: visas.filter((v) => {
            const days = differenceInDays(parseISO(v.expiry_date), new Date());
            return days >= 0 && days < 90;
        }).length,
        expired: visas.filter((v) => differenceInDays(parseISO(v.expiry_date), new Date()) < 0).length,
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Visas</h1>
                    <p className="text-gray-500 mt-1">Track and manage all work permits and visas.</p>
                </div>
                <button className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20">
                    <Plus className="w-4 h-4" />
                    Add Visa
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <button
                    onClick={() => setFilter("all")}
                    className={`p-4 rounded-xl border transition-all ${filter === "all"
                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                            : "bg-white border-gray-100 hover:border-gray-200"
                        }`}
                >
                    <p className={`text-2xl font-bold ${filter === "all" ? "text-white" : "text-gray-900"}`}>
                        {stats.total}
                    </p>
                    <p className={`text-sm ${filter === "all" ? "text-white/80" : "text-gray-500"}`}>
                        Total Visas
                    </p>
                </button>
                <button
                    onClick={() => setFilter("valid")}
                    className={`p-4 rounded-xl border transition-all ${filter === "valid"
                            ? "bg-green-600 text-white border-green-600 shadow-lg shadow-green-600/20"
                            : "bg-white border-gray-100 hover:border-gray-200"
                        }`}
                >
                    <p className={`text-2xl font-bold ${filter === "valid" ? "text-white" : "text-green-600"}`}>
                        {stats.valid}
                    </p>
                    <p className={`text-sm ${filter === "valid" ? "text-white/80" : "text-gray-500"}`}>
                        Valid
                    </p>
                </button>
                <button
                    onClick={() => setFilter("expiring")}
                    className={`p-4 rounded-xl border transition-all ${filter === "expiring"
                            ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20"
                            : "bg-white border-gray-100 hover:border-gray-200"
                        }`}
                >
                    <p className={`text-2xl font-bold ${filter === "expiring" ? "text-white" : "text-amber-500"}`}>
                        {stats.expiring}
                    </p>
                    <p className={`text-sm ${filter === "expiring" ? "text-white/80" : "text-gray-500"}`}>
                        Expiring Soon
                    </p>
                </button>
                <button
                    onClick={() => setFilter("expired")}
                    className={`p-4 rounded-xl border transition-all ${filter === "expired"
                            ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/20"
                            : "bg-white border-gray-100 hover:border-gray-200"
                        }`}
                >
                    <p className={`text-2xl font-bold ${filter === "expired" ? "text-white" : "text-red-600"}`}>
                        {stats.expired}
                    </p>
                    <p className={`text-sm ${filter === "expired" ? "text-white/80" : "text-gray-500"}`}>
                        Expired
                    </p>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by employee name, passport, or permit number..."
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Visas Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-16 flex flex-col justify-center items-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-sm text-gray-500 mt-3">Loading visas...</p>
                    </div>
                ) : filteredVisas.length === 0 ? (
                    <div className="p-16 text-center">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-900 font-medium">No visas found</p>
                        <p className="text-gray-500 text-sm mt-1">
                            {searchQuery || filter !== "all"
                                ? "Try adjusting your filters or search query."
                                : "Add your first visa to get started."}
                        </p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Visa Type</TableHead>
                                <TableHead>Permit Number</TableHead>
                                <TableHead>Issue Date</TableHead>
                                <TableHead>Expiry Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredVisas.map((visa) => {
                                const daysUntilExpiry = differenceInDays(parseISO(visa.expiry_date), new Date());

                                return (
                                    <TableRow key={visa.id} className="group">
                                        <TableCell>
                                            {visa.employee ? (
                                                <Link
                                                    href={`/dashboard/employees/${visa.employee.id}`}
                                                    className="flex items-center gap-3 hover:underline"
                                                >
                                                    <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <span className="text-xs font-semibold text-primary">
                                                            {visa.employee.first_name[0]}
                                                            {visa.employee.last_name[0]}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {visa.employee.first_name} {visa.employee.last_name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 font-mono">
                                                            {visa.employee.passport_number}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ) : (
                                                <span className="text-gray-400">Unknown</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-700">{visa.visa_type}</TableCell>
                                        <TableCell className="font-mono text-xs text-gray-600">
                                            {visa.permit_number || "—"}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-gray-600">
                                            {format(parseISO(visa.issue_date), "dd MMM yyyy")}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-gray-600">
                                            {format(parseISO(visa.expiry_date), "dd MMM yyyy")}
                                        </TableCell>
                                        <TableCell>
                                            <VisaStatusBadge expiryDate={visa.expiry_date} />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}
