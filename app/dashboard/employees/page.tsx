"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEmployees } from "@/hooks/use-employees";
import { VisaStatusBadge } from "@/components/employees/status-badge";
import { AddEmployeeModal } from "@/components/employees/add-employee-modal";
import { format, parseISO } from "date-fns";
import {
    Loader2,
    Plus,
    Search,
    Eye,
    MoreHorizontal,
    Filter,
    Download,
    ChevronLeft,
    ChevronRight,
    ArrowUpRight
} from "lucide-react";
import { EmployeeTable } from "@/components/employees/employee-table";

export default function EmployeesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const { data: employees, isLoading, isError } = useEmployees(searchQuery);

    return (
        <div className="space-y-8 pb-12">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] bg-secondary/10 px-2 py-1 rounded">Personnel Management</span>
                    </div>
                    <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Workforce Registry</h1>
                    <p className="text-slate-500 mt-2 font-medium">Complete directory of TCN employees and documentation status.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex items-center gap-3"
                >
                    <button className="group relative inline-flex items-center gap-2 bg-white border-2 border-slate-100 text-slate-600 px-6 py-4 rounded-xl font-bold text-sm shadow-sm hover:border-secondary/20 hover:text-secondary transition-all hover:-translate-y-0.5">
                        <Download className="w-5 h-5 text-slate-400 group-hover:text-secondary transition-colors" />
                        Export Registry
                    </button>
                    <AddEmployeeModal>
                        <button className="group relative inline-flex items-center gap-2 bg-primary text-white px-6 py-4 rounded-xl font-bold text-sm shadow-premium hover:shadow-premium-hover transition-all hover:-translate-y-0.5 overflow-hidden">
                            <Plus className="w-5 h-5" />
                            Register Employee
                        </button>
                    </AddEmployeeModal>
                </motion.div>
            </div>

            {/* Filters Bar */}
            <motion.div
                className="bg-white rounded-3xl shadow-premium border border-slate-100 p-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-secondary transition-colors" />
                        <input
                            type="text"
                            placeholder="Universal search (name, passport, visa type, nationality)..."
                            className="w-full pl-12 pr-4 py-4 text-sm font-medium bg-slate-50 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/5 focus:bg-white transition-all shadow-inner"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="inline-flex items-center gap-3 px-6 py-4 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-secondary/20 hover:text-secondary transition-all">
                        <Filter className="w-4 h-4" />
                        Advanced Filters
                    </button>
                </div>
            </motion.div>

            {/* Employees Table Container */}
            <motion.div
                className="bg-white rounded-[32px] shadow-premium border border-slate-100 overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                {isLoading ? (
                    <div className="p-24 flex flex-col justify-center items-center">
                        <Loader2 className="w-10 h-10 animate-spin text-secondary mb-4" />
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Compiling Database...</p>
                    </div>
                ) : isError ? (
                    <div className="p-24 text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>
                        <p className="text-slate-900 font-bold">Data Fetch Interrupted</p>
                        <button onClick={() => window.location.reload()} className="text-secondary font-bold text-sm hover:underline mt-2">Retry Connection</button>
                    </div>
                ) : (
                    <>
                        <div className="p-2">
                            <EmployeeTable employees={employees || []} />
                        </div>

                        {/* Pagination */}
                        <div className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
                            <p className="text-sm font-bold text-slate-400 italic">
                                Total records: <span className="text-slate-900 not-italic">{employees?.length || 0}</span>
                            </p>
                            <div className="flex items-center gap-3">
                                <button aria-label="Previous page" className="p-3 rounded-xl border-2 border-slate-100 hover:border-secondary/20 hover:text-secondary transition-all disabled:opacity-30 disabled:hover:border-slate-100 disabled:hover:text-slate-300" disabled>
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-1">
                                    <span className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-xl font-bold text-sm shadow-premium">1</span>
                                </div>
                                <button aria-label="Next page" className="p-3 rounded-xl border-2 border-slate-100 hover:border-secondary/20 hover:text-secondary transition-all disabled:opacity-30 disabled:hover:border-slate-100 disabled:hover:text-slate-300" disabled>
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}

// Simple Helper Components for the page
function AlertTriangle({ className }: { className: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" />
        </svg>
    );
}
