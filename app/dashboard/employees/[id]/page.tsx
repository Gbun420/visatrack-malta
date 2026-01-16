"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format, parseISO, differenceInDays } from "date-fns";
import { Employee, Visa } from "@/types";
import { VisaStatusBadge, EmploymentStatusBadge } from "@/components/employees/status-badge";
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
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError || !employee) {
        return (
            <div className="text-center py-16">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Employee not found</h2>
                <p className="text-gray-500 mb-4">
                    The employee you&apos;re looking for doesn&apos;t exist or has been removed.
                </p>
                <Link
                    href="/dashboard/employees"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Employees
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
        <div className="space-y-6">
            {/* Back Button */}
            <Link
                href="/dashboard/employees"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Employees
            </Link>

            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-teal-500 h-32" />
                <div className="px-6 pb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
                        <div className="w-24 h-24 bg-white rounded-xl shadow-lg flex items-center justify-center border-4 border-white">
                            <span className="text-3xl font-bold text-primary">
                                {employee.first_name[0]}
                                {employee.last_name[0]}
                            </span>
                        </div>
                        <div className="flex-1 pt-2">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {employee.first_name} {employee.last_name}
                            </h1>
                            <p className="text-gray-500">
                                {employee.position || "No position"} • {employee.department || "No department"}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="gap-2">
                                <Edit className="w-4 h-4" />
                                Edit
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => setShowDeleteDialog(true)}
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Contact Information */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <InfoItem
                                icon={Mail}
                                label="Email"
                                value={employee.email || "Not provided"}
                            />
                            <InfoItem
                                icon={Phone}
                                label="Phone"
                                value={employee.phone || "Not provided"}
                            />
                            <InfoItem
                                icon={MapPin}
                                label="Nationality"
                                value={employee.nationality || "Not provided"}
                            />
                            <InfoItem
                                icon={Briefcase}
                                label="Department"
                                value={employee.department || "Not assigned"}
                            />
                        </div>
                    </div>

                    {/* Employment Details */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Employment Details</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <InfoItem
                                icon={Shield}
                                label="Passport Number"
                                value={employee.passport_number}
                                mono
                            />
                            <InfoItem
                                icon={Calendar}
                                label="Passport Expiry"
                                value={
                                    employee.passport_expiry
                                        ? format(parseISO(employee.passport_expiry), "dd MMM yyyy")
                                        : "Not provided"
                                }
                            />
                            <InfoItem
                                icon={Calendar}
                                label="Start Date"
                                value={
                                    employee.employment_start_date
                                        ? format(parseISO(employee.employment_start_date), "dd MMM yyyy")
                                        : "Not provided"
                                }
                            />
                            <InfoItem
                                icon={User}
                                label="Employment Status"
                                value={<EmploymentStatusBadge status={employee.status} />}
                            />
                        </div>
                    </div>

                    {/* Visa History */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Visa History</h2>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Plus className="w-4 h-4" />
                                Add Visa
                            </Button>
                        </div>

                        {employee.visas && employee.visas.length > 0 ? (
                            <div className="space-y-4">
                                {employee.visas.map((visa) => (
                                    <VisaCard key={visa.id} visa={visa} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p>No visa records found.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Compliance Status Card */}
                    <div
                        className={`rounded-xl shadow-sm border p-6 ${daysUntilExpiry === null
                            ? "bg-gray-50 border-gray-200"
                            : daysUntilExpiry < 0
                                ? "bg-red-50 border-red-200"
                                : daysUntilExpiry < 90
                                    ? "bg-amber-50 border-amber-200"
                                    : "bg-green-50 border-green-200"
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            {daysUntilExpiry === null ? (
                                <AlertTriangle className="w-6 h-6 text-gray-500" />
                            ) : daysUntilExpiry < 0 ? (
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            ) : daysUntilExpiry < 90 ? (
                                <Clock className="w-6 h-6 text-amber-600" />
                            ) : (
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            )}
                            <h3 className="font-semibold text-gray-900">Compliance Status</h3>
                        </div>

                        {activeVisa ? (
                            <>
                                <div className="mb-4">
                                    <VisaStatusBadge expiryDate={activeVisa.expiry_date} />
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Visa Type</span>
                                        <span className="font-medium">{activeVisa.visa_type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Expiry Date</span>
                                        <span className="font-medium font-mono">
                                            {format(parseISO(activeVisa.expiry_date), "dd MMM yyyy")}
                                        </span>
                                    </div>
                                    {daysUntilExpiry !== null && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Days Remaining</span>
                                            <span
                                                className={`font-bold ${daysUntilExpiry < 0
                                                    ? "text-red-600"
                                                    : daysUntilExpiry < 90
                                                        ? "text-amber-600"
                                                        : "text-green-600"
                                                    }`}
                                            >
                                                {daysUntilExpiry < 0 ? `${Math.abs(daysUntilExpiry)} days overdue` : `${daysUntilExpiry} days`}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {daysUntilExpiry !== null && daysUntilExpiry < 90 && daysUntilExpiry >= 0 && (
                                    <Button className="w-full mt-4" size="sm">
                                        Start Renewal Process
                                    </Button>
                                )}
                            </>
                        ) : (
                            <p className="text-gray-500 text-sm">No active visa on record.</p>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-3">
                                <Plus className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">Add New Visa</span>
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-3">
                                <FileText className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">Upload Document</span>
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">Schedule Reminder</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Employee</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {employee.first_name} {employee.last_name}?
                            This action cannot be undone and will remove all associated visa and document records.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Delete Employee
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function InfoItem({
    icon: Icon,
    label,
    value,
    mono = false,
}: {
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
    mono?: boolean;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-gray-500" />
            </div>
            <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className={`text-gray-900 ${mono ? "font-mono text-sm" : ""}`}>{value}</p>
            </div>
        </div>
    );
}

function VisaCard({ visa }: { visa: Visa }) {
    const daysUntilExpiry = differenceInDays(parseISO(visa.expiry_date), new Date());

    return (
        <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <p className="font-medium text-gray-900">{visa.visa_type}</p>
                    {visa.permit_number && (
                        <p className="text-xs text-gray-500 font-mono">{visa.permit_number}</p>
                    )}
                </div>
                <VisaStatusBadge expiryDate={visa.expiry_date} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                    <p className="text-xs text-gray-500">Issue Date</p>
                    <p className="font-mono text-gray-700">
                        {format(parseISO(visa.issue_date), "dd MMM yyyy")}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Expiry Date</p>
                    <p className="font-mono text-gray-700">
                        {format(parseISO(visa.expiry_date), "dd MMM yyyy")}
                    </p>
                </div>
            </div>
        </div>
    );
}
