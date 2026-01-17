"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { format, parseISO, differenceInDays } from "date-fns";
import { Employee, Visa } from "@/types";
import { VisaStatusBadge, EmploymentStatusBadge } from "@/components/employees/status-badge";
import { cn } from "@/lib/utils";
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Calendar,
    FileText,
    Shield,
    Clock,
    Edit,
    Trash2,
    Plus,
    AlertTriangle,
    CheckCircle,
    Loader2,
    Globe,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function EmployeeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        async function fetchEmployee() {
            try {
                const response = await fetch(`/api/employees/${params.id}`);
                if (!response.ok) throw new Error("Failed to fetch");
                const data = await response.json();
                setEmployee(data);
            } catch (error) {
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        }

        if (params.id) {
            fetchEmployee();
        }
    }, [params.id]);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/employees/${params.id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete");
            toast({
                title: "Employee deleted",
                description: "The employee has been removed from your records.",
            });
            router.push("/dashboard/employees");
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete employee.",
            });
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-secondary mb-4" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Records...</p>
            </div>
        );
    }

    if (isError || !employee) {
        return (
            <div className="max-w-xl mx-auto text-center py-20 px-6">
                <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-red-100">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Record Not Found</h2>
                <p className="text-slate-500 mb-8 font-medium">
                    The employee record you are attempting to access does not exist or may have been archived.
                </p>
                <Link
                    href="/dashboard/employees"
                    className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-premium hover:shadow-premium-hover transition-all"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Registry
                </Link>
            </div>
        );
    }

    const activeVisa = employee.visas?.find(
        (v) => v.status === "valid" || v.application_status === "active"
    );
    const daysUntilExpiry = activeVisa
        ? differenceInDays(parseISO(activeVisa.expiry_date), new Date())
        : null;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header / Breadcrumb */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
            >
                <Link
                    href="/dashboard/employees"
                    className="group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary transition-colors"
                >
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center group-hover:border-primary transition-colors shadow-sm">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span>Back to Workforce Registry</span>
                </Link>
            </motion.div>

            {/* Profile Hero */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] shadow-premium border border-slate-100 overflow-hidden"
            >
                <div className="bg-primary h-32 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full -mr-20 -mt-20 blur-3xl opacity-50" />
                    <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-accent/20 rounded-full -mb-10 blur-3xl opacity-30" />
                </div>
                <div className="px-8 pb-8 -mt-12 relative z-10">
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                        <div className="w-28 h-28 bg-white rounded-3xl shadow-xl flex items-center justify-center border-4 border-white overflow-hidden group">
                            <div className="w-full h-full bg-slate-50 flex items-center justify-center text-3xl font-display font-bold text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                {employee.first_name[0]}{employee.last_name[0]}
                            </div>
                        </div>
                        <div className="flex-1 pb-2">
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
                                    {employee.first_name} {employee.last_name}
                                </h1>
                                <EmploymentStatusBadge status={employee.status} />
                            </div>
                            <p className="text-slate-400 font-bold text-sm flex items-center gap-2">
                                <span className="text-secondary">{employee.position || "N/A"}</span>
                                <span className="text-slate-200">|</span>
                                <span>{employee.department || "N/A"}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-3 pb-2">
                            <Button variant="outline" className="rounded-xl border-slate-100 font-bold hover:bg-slate-50 gap-2 px-6 py-6 border-2 text-slate-600">
                                <Edit className="w-4 h-4" />
                                Edit Record
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-xl border-red-50 font-bold hover:bg-red-50 gap-2 px-6 py-6 border-2 text-red-600"
                                onClick={() => setShowDeleteDialog(true)}
                            >
                                <Trash2 className="w-4 h-4" />
                                Archive
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Content Layout */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main dossier */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Official Details */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-[28px] shadow-premium border border-slate-100 p-8"
                    >
                        <div className="flex items-center gap-2 mb-8">
                            <div className="w-1.5 h-6 bg-secondary rounded-full" />
                            <h2 className="text-xl font-display font-bold text-slate-900">Personnel Dossier</h2>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
                            <InfoItem icon={Mail} label="Corporate Email" value={employee.email} />
                            <InfoItem icon={Phone} label="Direct Contact" value={employee.phone} />
                            <InfoItem icon={Globe} label="Nationality" value={employee.nationality} />
                            <InfoItem icon={Briefcase} label="Department Units" value={employee.department} />
                            <InfoItem icon={Shield} label="Passport Control #" value={employee.passport_number} mono />
                            <InfoItem
                                icon={Calendar}
                                label="Passport Valid Until"
                                value={employee.passport_expiry ? format(parseISO(employee.passport_expiry), "MMM dd, yyyy") : "N/A"}
                            />
                        </div>
                    </motion.div>

                    {/* Visa History */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-[28px] shadow-premium border border-slate-100 p-8"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-6 bg-accent rounded-full" />
                                <h2 className="text-xl font-display font-bold text-slate-900">Visa Documentation</h2>
                            </div>
                            <Button className="bg-primary text-white rounded-xl font-bold gap-2 px-4 shadow-premium hover:shadow-premium-hover hover:-translate-y-0.5 transition-all">
                                <Plus className="w-4 h-4" />
                                Add Permit
                            </Button>
                        </div>

                        {employee.visas && employee.visas.length > 0 ? (
                            <div className="grid gap-4">
                                {employee.visas.map((visa, idx) => (
                                    <VisaCard key={visa.id} visa={visa} index={idx} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <FileText className="w-10 h-10 mx-auto mb-4 text-slate-300" />
                                <p className="text-slate-400 font-bold text-sm tracking-wide uppercase">No Documentation Found</p>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-8">
                    {/* Strategic Compliance Health */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className={cn(
                            "rounded-[28px] shadow-premium border p-8 flex flex-col",
                            daysUntilExpiry === null ? "bg-slate-50 border-slate-200" :
                                daysUntilExpiry < 0 ? "bg-red-50 border-red-100" :
                                    daysUntilExpiry < 90 ? "bg-amber-50 border-amber-100" :
                                        "bg-green-50 border-green-100"
                        )}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner",
                                daysUntilExpiry === null ? "bg-slate-100 text-slate-400" :
                                    daysUntilExpiry < 0 ? "bg-red-100 text-red-600" :
                                        daysUntilExpiry < 90 ? "bg-amber-100 text-amber-600" :
                                            "bg-green-100 text-green-600"
                            )}>
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-slate-900">Compliance Health</h3>
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status Overview</p>
                            </div>
                        </div>

                        {activeVisa ? (
                            <div className="space-y-6">
                                <div className="p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Active Permit</span>
                                        <VisaStatusBadge expiryDate={activeVisa.expiry_date} />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[13px] font-bold text-slate-400 uppercase tracking-tighter">Classification</span>
                                            <span className="text-[13px] font-bold text-slate-900">{activeVisa.visa_type}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[13px] font-bold text-slate-400 uppercase tracking-tighter">Valid Until</span>
                                            <span className="text-[13px] font-bold text-slate-900">{format(parseISO(activeVisa.expiry_date), "MMM dd, yyyy")}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <div className="text-4xl font-display font-bold text-slate-900 mb-1">
                                        {daysUntilExpiry === null ? "—" : daysUntilExpiry < 0 ? "Overdue" : daysUntilExpiry}
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {daysUntilExpiry === null ? "No Active Permit" : daysUntilExpiry < 0 ? "Compliance Breach Days" : "Days to Expiration"}
                                    </p>
                                </div>

                                {daysUntilExpiry !== null && daysUntilExpiry < 90 && (
                                    <Button className="w-full bg-slate-900 text-white rounded-xl font-bold py-6 shadow-premium hover:shadow-premium-hover transition-all">
                                        Initiate Renewal Dossier
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="py-6 text-center">
                                <AlertTriangle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-sm font-bold text-slate-400 uppercase leading-relaxed">System critical:<br />No active permit found.</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Operational Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-[28px] shadow-premium border border-slate-100 p-8"
                    >
                        <h3 className="text-lg font-display font-bold text-slate-900 mb-6">Operational Actions</h3>
                        <div className="space-y-3">
                            <ActionBtn icon={FileText} label="Request Document Scan" />
                            <ActionBtn icon={Clock} label="Set Manual Reminder" />
                            <ActionBtn icon={ExternalLink} label="Export Dossier (PDF)" />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Delete Confirmation */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="rounded-3xl border-none shadow-premium p-8 max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-display font-bold text-slate-900">Archive Employee Record?</DialogTitle>
                        <DialogDescription className="pt-4 text-slate-500 font-medium leading-relaxed">
                            This action will move <span className="text-slate-900 font-bold">{employee.first_name} {employee.last_name}</span> into the inactive archive. All historical visa documentation will be preserved but the employee will no longer appear in the active compliance registry.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-8 sm:justify-start gap-3">
                        <Button
                            variant="outline"
                            className="flex-1 rounded-xl font-bold py-6 border-slate-100 text-slate-400"
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            className="flex-1 rounded-xl font-bold py-6 bg-red-600 hover:bg-red-700 shadow-premium"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Archive"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function InfoItem({ icon: Icon, label, value, mono = false }: { icon: any, label: string, value: any, mono?: boolean }) {
    return (
        <div className="group">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-secondary/10 group-hover:text-secondary transition-colors border border-transparent group-hover:border-secondary/20">
                    <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
            </div>
            <p className={cn(
                "font-bold text-slate-900 pl-11",
                mono ? "font-mono text-sm tracking-tighter" : "text-base tracking-tight"
            )}>
                {value || <span className="text-slate-200">Not Provided</span>}
            </p>
        </div>
    );
}

function VisaCard({ visa, index }: { visa: Visa, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + (index * 0.1) }}
            className="group relative overflow-hidden bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-secondary/20 hover:bg-white transition-all cursor-pointer shadow-sm hover:shadow-premium"
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-primary shadow-sm">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-display font-bold text-slate-900">{visa.visa_type}</p>
                        <p className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-tighter">{visa.permit_number || "NO PERMIT #"}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Expiration Date</p>
                        <p className="text-sm font-bold text-slate-900 tracking-tight">{format(parseISO(visa.expiry_date), "MMM dd, yyyy")}</p>
                    </div>
                    <VisaStatusBadge expiryDate={visa.expiry_date} />
                    <button
                        title="Edit Visa"
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-300 hover:text-slate-600 transition-all"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

function ActionBtn({ icon: Icon, label }: { icon: any, label: string }) {
    return (
        <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-slate-50 text-slate-600 border border-slate-50 hover:border-secondary/20 hover:bg-white hover:text-secondary group transition-all shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-100 group-hover:border-secondary/20 transition-all">
                <Icon className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold">{label}</span>
        </button>
    );
}
