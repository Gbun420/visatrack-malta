"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { EmployeeTable } from "@/components/employees/employee-table";
import { useEmployees } from "@/hooks/use-employees";
import { cn } from "@/lib/utils";
import {
  Loader2,
  Plus,
  Search,
  Info,
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AddEmployeeModal } from "@/components/employees/add-employee-modal";
import { Sparkline } from "@/components/ui/sparkline";

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
    <div className="space-y-10 pb-12">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] bg-secondary/10 px-2 py-1 rounded">Executive Portal</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Workforce Compliance</h1>
          <p className="text-slate-500 mt-2 font-medium">Real-time oversight of your international employee documentation.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AddEmployeeModal>
            <button className="group relative inline-flex items-center gap-2 bg-primary text-white px-6 py-4 rounded-xl font-bold text-sm shadow-premium hover:shadow-premium-hover transition-all hover:-translate-y-0.5 overflow-hidden">
              <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              <Plus className="w-5 h-5" />
              Register New Employee
            </button>
          </AddEmployeeModal>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total TCNs"
          value={isLoading ? "—" : totalEmployees.toString()}
          icon={Users}
          trend="+12% from last month"
          trendUp={true}
          sparkData={[30, 40, 35, 50, 45, 60, 55]}
          color="#0F172A"
          delay={0.1}
        />
        <StatCard
          title="Expiring Soon"
          value={isLoading ? "—" : expiringSoonCount.toString()}
          subtitle="Critical (90 Days)"
          icon={AlertTriangle}
          trend="-2% improvement"
          trendUp={true} // Lower expiring is good
          sparkData={[10, 8, 12, 5, 8, 15, 8]}
          color="#F59E0B"
          delay={0.2}
        />
        <StatCard
          title="Documents Expired"
          value={isLoading ? "—" : expiredCount.toString()}
          subtitle="Non-compliant"
          icon={TrendingDown}
          trend="-5% from last week"
          trendUp={true} // Lower expired is good
          sparkData={[5, 4, 6, 2, 3, 5, 2]}
          color="#EF4444"
          delay={0.3}
        />
        <StatCard
          title="Compliance Health"
          value={isLoading ? "—" : `${complianceHealth}%`}
          icon={CheckCircle}
          trend="Target: 98%"
          trendUp={complianceHealth >= 95}
          sparkData={[85, 88, 92, 90, 94, 93, 95]}
          color={complianceHealth >= 90 ? "#10B981" : "#F59E0B"}
          hasInfo
          infoText="Aggregate score of workforce documentation validity."
          delay={0.4}
        />
      </div>

      {/* Main Content Area */}
      <motion.div
        className="bg-white rounded-[24px] shadow-premium border border-slate-100 overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="p-6 lg:p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900">Compliance Registry</h2>
            <p className="text-sm text-slate-400 font-medium">Detailed breakdown of employee documentation status.</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-secondary transition-colors" />
              <input
                type="text"
                placeholder="Filter by name, ID, or permit..."
                className="text-sm font-medium bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3.5 w-full focus:outline-none focus:ring-4 focus:ring-secondary/5 focus:bg-white transition-all shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="relative">
          {isLoading ? (
            <div className="p-24 flex flex-col justify-center items-center">
              <div className="relative w-12 h-12">
                <Loader2 className="w-12 h-12 animate-spin text-secondary" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
              </div>
              <p className="text-sm font-bold text-slate-400 mt-6 tracking-widest uppercase">Fetching Records...</p>
            </div>
          ) : isError ? (
            <div className="p-24 text-center">
              <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-red-100">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <p className="text-slate-900 font-bold text-xl">System Unresponsive</p>
              <p className="text-slate-400 mt-2 font-medium">Verify your network connection or Supabase credentials.</p>
            </div>
          ) : (
            <div className="p-2 lg:p-4">
              <EmployeeTable employees={employees || []} />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendUp,
  sparkData,
  color,
  hasInfo = false,
  infoText = "",
  delay = 0
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  sparkData: number[];
  color: string;
  hasInfo?: boolean;
  infoText?: string;
  delay?: number;
}) {
  const colorMap: Record<string, { bg: string, text: string }> = {
    "#0F172A": { bg: "bg-slate-900/10", text: "text-slate-900" },
    "#F59E0B": { bg: "bg-amber-500/10", text: "text-amber-500" },
    "#EF4444": { bg: "bg-red-500/10", text: "text-red-500" },
    "#10B981": { bg: "bg-emerald-500/10", text: "text-emerald-500" },
  };

  const colorStyles = colorMap[color] || { bg: "bg-primary/10", text: "text-primary" };

  return (
    <motion.div
      className="bg-white p-7 rounded-[28px] shadow-premium border border-slate-100 hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-300 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-start justify-between mb-6">
        <div
          className={cn(
            "w-12 h-12 rounded-[18px] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300",
            colorStyles.bg,
            colorStyles.text
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
        {hasInfo && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button aria-label="More information" className="text-slate-300 hover:text-slate-600 transition-colors p-1">
                  <Info className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-slate-900 text-white border-none rounded-xl p-3 shadow-premium">
                <p className="max-w-[180px] text-xs font-semibold leading-relaxed">{infoText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-display font-bold text-slate-900 tracking-tight leading-none mb-2">{value}</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
          </div>
          <Sparkline data={sparkData} color={color} />
        </div>

        <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className={cn(
            "flex items-center gap-1 text-[11px] font-bold",
            trendUp ? "text-green-500" : "text-red-500"
          )}>
            <ArrowUpRight className={cn("w-3 h-3", !trendUp && "rotate-90")} />
            {trend}
          </div>
          {subtitle && (
            <span className="text-[10px] bg-slate-50 text-slate-400 font-bold px-2 py-0.5 rounded-full">{subtitle}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}