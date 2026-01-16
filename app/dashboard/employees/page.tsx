"use client";

import { useState } from "react";
import Link from "next/link";
import { useEmployees } from "@/hooks/use-employees";
import { VisaStatusBadge, EmploymentStatusBadge } from "@/components/employees/status-badge";
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
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function EmployeesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const { data: employees, isLoading, isError } = useEmployees(searchQuery);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
                    <p className="text-gray-500 mt-1">
                        Manage your TCN workforce and their documentation.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <AddEmployeeModal>
                        <button className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20">
                            <Plus className="w-4 h-4" />
                            Add Employee
                        </button>
                    </AddEmployeeModal>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, passport, or nationality..."
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                </div>
            </div>

            {/* Employees Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-16 flex flex-col justify-center items-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-sm text-gray-500 mt-3">Loading employees...</p>
                    </div>
                ) : isError ? (
                    <div className="p-16 text-center text-red-600">
                        Error loading employees. Please try again.
                    </div>
                ) : employees?.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-900 font-medium">No employees yet</p>
                        <p className="text-gray-500 text-sm mt-1 mb-4">
                            Get started by adding your first TCN employee.
                        </p>
                        <AddEmployeeModal>
                            <button className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium">
                                <Plus className="w-4 h-4" />
                                Add Employee
                            </button>
                        </AddEmployeeModal>
                    </div>
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[250px]">Employee</TableHead>
                                    <TableHead>Passport</TableHead>
                                    <TableHead>Nationality</TableHead>
                                    <TableHead>Visa Type</TableHead>
                                    <TableHead>Expiry</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employees?.map((employee) => {
                                    const activeVisa = employee.visas?.find(
                                        (v) => v.application_status === "active" || v.status === "valid" || v.status === "expired"
                                    );

                                    return (
                                        <TableRow key={employee.id} className="group">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 bg-gradient-to-br from-primary/20 to-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <span className="text-xs font-semibold text-primary">
                                                            {employee.first_name[0]}
                                                            {employee.last_name[0]}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {employee.first_name} {employee.last_name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {employee.position || "No position"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono text-xs uppercase tracking-wider text-gray-600">
                                                {employee.passport_number}
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-600">
                                                {employee.nationality || "—"}
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-600">
                                                {activeVisa?.visa_type || "—"}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs text-gray-600">
                                                {activeVisa?.expiry_date
                                                    ? format(parseISO(activeVisa.expiry_date), "dd MMM yyyy")
                                                    : "—"}
                                            </TableCell>
                                            <TableCell>
                                                <VisaStatusBadge expiryDate={activeVisa?.expiry_date} />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        href={`/dashboard/employees/${employee.id}`}
                                                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                                    >
                                                        <Eye className="w-4 h-4 text-gray-500" />
                                                    </Link>
                                                    <button aria-label="More options" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                                        <MoreHorizontal className="w-4 h-4 text-gray-500" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Showing <span className="font-medium">{employees?.length}</span> employees
                            </p>
                            <div className="flex items-center gap-2">
                                <button aria-label="Previous page" className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50" disabled>
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button aria-label="Next page" className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50" disabled>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
