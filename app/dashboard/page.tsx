"use client";

import { useState } from "react";
import { EmployeeTable } from "@/components/employees/employee-table";
import { useEmployees } from "@/hooks/use-employees";
import { cn } from "@/lib/utils";
import { Loader2, Plus, Search, Info } from "lucide-react";
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
    if (health >= 90) return "text-success"; // Green (#10B981)
    if (health >= 70) return "text-accent";  // Yellow (#F59E0B)
    return "text-error";                     // Red (#EF4444)
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ... header ... */}
      <header className="border-b bg-white">
        {/* ... */}
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* ... titles ... */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary">Workforce Overview</h1>
            <p className="text-muted-foreground mt-1 text-sm">Manage TCN compliance and visa renewals.</p>
          </div>
          <AddEmployeeModal>
            <button className="bg-primary text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Employee
            </button>
          </AddEmployeeModal>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total TCNs" value={isLoading ? "..." : totalEmployees.toString()} />
          <StatCard 
            title="Expiring Soon" 
            value={isLoading ? "..." : expiringSoonCount.toString()} 
            color="text-accent" 
          />
          <StatCard 
            title="Expired" 
            value={isLoading ? "..." : expiredCount.toString()} 
            color="text-error" 
          />
          <StatCard 
            title="Compliance Health" 
            value={isLoading ? "..." : `${complianceHealth}%`} 
            color={isLoading ? "text-secondary" : getHealthColor(complianceHealth)}
            hasInfo
            infoText="Compliance Health = Employees with valid visas / Total employees"
          />
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-4 border-b bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="font-semibold text-secondary">Employee Compliance List</h2>
            <div className="relative w-full sm:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
               <input 
                type="text" 
                placeholder="Search passport or name..." 
                className="text-xs border rounded-md pl-9 pr-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
          </div>
          
          {isLoading ? (
            <div className="p-12 flex justify-center items-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="p-12 text-center text-error">
              Error loading employee data. Please try again.
            </div>
          ) : (
            <EmployeeTable employees={employees || []} />
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  color = "text-secondary", 
  hasInfo = false, 
  infoText = "" 
}: { 
  title: string, 
  value: string, 
  color?: string,
  hasInfo?: boolean,
  infoText?: string
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border relative">
      <div className="flex items-center gap-1">
        <h3 className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">{title}</h3>
        {hasInfo && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-secondary">
                  <Info className="w-3 h-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{infoText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <p className={cn("text-3xl font-bold mt-2", color)}>{value}</p>
    </div>
  );
}