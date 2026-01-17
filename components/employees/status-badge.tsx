"use client";

import { differenceInDays, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface VisaStatusBadgeProps {
  expiryDate?: string;
}

export function VisaStatusBadge({ expiryDate }: VisaStatusBadgeProps) {
  if (!expiryDate) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-400 border border-slate-200">
        No Record
      </span>
    );
  }

  const today = new Date();
  const expiry = parseISO(expiryDate);
  const daysUntilExpiry = differenceInDays(expiry, today);

  if (daysUntilExpiry < 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-100 shadow-sm">
        Expired
      </span>
    );
  }

  if (daysUntilExpiry < 90) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100 shadow-sm">
        Expiring ({daysUntilExpiry}d)
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-600 border border-green-100 shadow-sm">
      Valid
    </span>
  );
}

interface EmploymentStatusBadgeProps {
  status: 'active' | 'pending' | 'inactive' | 'on_leave' | 'terminated';
}

export function EmploymentStatusBadge({ status }: EmploymentStatusBadgeProps) {
  const styles = {
    active: "bg-green-50 text-green-600 border-green-100",
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    inactive: "bg-slate-50 text-slate-500 border-slate-100",
    on_leave: "bg-blue-50 text-blue-600 border-blue-100",
    terminated: "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border",
      styles[status] || "bg-slate-100 text-slate-400 border-slate-200"
    )}>
      {status.replace('_', ' ')}
    </span>
  );
}