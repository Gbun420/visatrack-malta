"use client";

import { useState } from "react";
import { EmployeeTable } from "@/components/employees/employee-table";
import { useEmployees } from "@/hooks/use-employees";
import { cn } from "@/lib/utils";
import { Loader2, Plus, Search, Info, TrendingUp, TrendingDown, Users, AlertTriangle, CheckCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AddEmployeeModal } from "@/components/employees/add-employee-modal";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: employees, isLoading, isError } = useEmployees(searchQuery);

  // Derived stats
  const expiringSoonCount = employees?.filter(emp => {
    const activeVisa = emp.visas?.find(v => v.application_status === 'active' || v.status === 'valid');
    if (!activeVisa) return false;
    const days = Math.ceil((new Date(activeVisa.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days >= 0 && days < 90;
  }).length || 0;

  const expiredCount = employees?.filter(emp => {
    const activeVisa = emp.visas?.find(v => v.application_status === 'active' || v.status === 'valid' || v.status === 'expired');
    if (!activeVisa) return false;
    const days = (new Date(activeVisa.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
    return days < 0;
  }).length || 0;

  // Compliance Health Calculation
  const totalEmployees = employees?.length || 0;
  const validVisasCount = employees?.filter(emp => {
    const activeVisa = emp.visas?.find(v => v.application_status === 'active' || v.status === 'valid');
    if (!activeVisa) return false;
    const days = (new Date(activeVisa.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
    return days >= 0;
  }).length || 0;

  const complianceHealth = totalEmployees === 0
    ? 100
    : Math.round((validVisasCount / totalEmployees) * 100);

  const getHealthColor = (health: number) => {
    if (health >= 90) return "text-green-600";
    if (health >= 70) return "text-amber-500";
    return "text-red-500";
  };

  const getHealthBg = (health: number) => {
    if (health >= 90) return "bg-green-50 border-green-100";
    if (health >= 70) return "bg-amber-50 border-amber-100";
    return "bg-red-50 border-red-100";
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workforce Overview</h1>
          <p className="text-gray-500 mt-1">Manage TCN compliance and visa renewals.</p>
        </div>
        <AddEmployeeModal>
          <button className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20">
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </AddEmployeeModal>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total TCNs"
          value={isLoading ? "—" : totalEmployees.toString()}
          icon={Users}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Expiring Soon"
          value={isLoading ? "—" : expiringSoonCount.toString()}
          subtitle="Next 90 days"
          icon={AlertTriangle}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          valueColor="text-amber-600"
        />
        <StatCard
          title="Expired"
          value={isLoading ? "—" : expiredCount.toString()}
          subtitle="Requires action"
          icon={TrendingDown}
          iconBg="bg-red-100"
          iconColor="text-red-600"
          valueColor="text-red-600"
        />
        <StatCard
          title="Compliance Health"
          value={isLoading ? "—" : `${complianceHealth}%`}
          icon={CheckCircle}
          iconBg={isLoading ? "bg-gray-100" : getHealthBg(complianceHealth)}
          iconColor={isLoading ? "text-gray-600" : getHealthColor(complianceHealth)}
          valueColor={isLoading ? "text-gray-900" : getHealthColor(complianceHealth)}
          hasInfo
          infoText="Compliance Health = Employees with valid visas / Total employees"
        />
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="font-semibold text-gray-900">Employee Compliance List</h2>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or passport..."
              className="text-sm border border-gray-200 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-16 flex flex-col justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-gray-500 mt-3">Loading employees...</p>
          </div>
        ) : isError ? (
          <div className="p-16 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-gray-900 font-medium">Error loading employee data</p>
            <p className="text-gray-500 text-sm mt-1">Please try refreshing the page.</p>
          </div>
        ) : (
          <EmployeeTable employees={employees || []} />
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg = "bg-gray-100",
  iconColor = "text-gray-600",
  valueColor = "text-gray-900",
  hasInfo = false,
  infoText = ""
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  iconBg?: string;
  iconColor?: string;
  valueColor?: string;
  hasInfo?: boolean;
  infoText?: string;
}) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", iconBg)}>
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
        {hasInfo && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button aria-label="More information" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Info className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="max-w-xs text-xs">{infoText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="mt-4">
        <p className={cn("text-2xl font-bold", valueColor)}>{value}</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{title}</p>
          {subtitle && (
            <span className="text-xs text-gray-400">• {subtitle}</span>
          )}
        </div>
      </div>
    </div>
  );
}