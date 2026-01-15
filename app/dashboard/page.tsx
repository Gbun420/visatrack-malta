"use client";

import { useState } from "react";
import { EmployeeTable } from "@/components/employees/employee-table";
import { useEmployees } from "@/hooks/use-employees";
import { cn } from "@/lib/utils";
import { Loader2, Plus, Search } from "lucide-react";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: employees, isLoading, isError } = useEmployees(searchQuery);

  // Derived stats
  const expiringSoonCount = employees?.filter(emp => {
    const activeVisa = emp.visas?.find(v => v.application_status === 'active');
    if (!activeVisa) return false;
    const days = Math.ceil((new Date(activeVisa.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days >= 0 && days < 90;
  }).length || 0;

  const expiredCount = employees?.filter(emp => {
    const activeVisa = emp.visas?.find(v => v.application_status === 'active');
    if (!activeVisa) return false;
    const days = (new Date(activeVisa.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
    return days < 0;
  }).length || 0;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold text-xl">
              V
            </div>
            <span className="text-xl font-bold tracking-tight text-secondary">
              VisaTrack <span className="text-primary">Malta</span>
            </span>
          </div>
          <nav className="flex gap-6">
            <span className="text-sm font-medium border-b-2 border-primary py-5">Employees</span>
            <span className="text-sm font-medium text-muted-foreground py-5 hover:text-secondary cursor-pointer">Documents</span>
            <span className="text-sm font-medium text-muted-foreground py-5 hover:text-secondary cursor-pointer">Reports</span>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary">Workforce Overview</h1>
            <p className="text-muted-foreground mt-1 text-sm">Manage TCN compliance and visa renewals.</p>
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total TCNs" value={isLoading ? "..." : (employees?.length || 0).toString()} />
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
          <StatCard title="Compliance Health" value={isLoading ? "..." : "94%"} />
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

function StatCard({ title, value, color = "text-secondary" }: { title: string, value: string, color?: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">{title}</h3>
      <p className={cn("text-3xl font-bold mt-2", color)}>{value}</p>
    </div>
  );
}
