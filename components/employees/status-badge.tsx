"use client";

import { Badge } from "@/components/ui/badge";
import { differenceInDays, parseISO } from "date-fns";

interface VisaStatusBadgeProps {
  expiryDate?: string;
}

export function VisaStatusBadge({ expiryDate }: VisaStatusBadgeProps) {
  if (!expiryDate) {
    return <Badge variant="outline" className="opacity-50 text-[10px] uppercase">No Record</Badge>;
  }

  const today = new Date();
  const expiry = parseISO(expiryDate);
  const daysUntilExpiry = differenceInDays(expiry, today);

  if (daysUntilExpiry < 0) {
    return <Badge variant="danger" className="uppercase text-[10px]">Expired</Badge>;
  }
  if (daysUntilExpiry < 90) {
    return <Badge variant="warning" className="uppercase text-[10px]">Expiring ({daysUntilExpiry}d)</Badge>;
  }
  return <Badge variant="success" className="uppercase text-[10px]">Valid</Badge>;
}

interface EmploymentStatusBadgeProps {
  status: 'active' | 'pending' | 'inactive' | 'on_leave' | 'terminated';
}

export function EmploymentStatusBadge({ status }: EmploymentStatusBadgeProps) {
  const variants = {
    active: "success",
    pending: "warning",
    inactive: "secondary",
    on_leave: "info",
    terminated: "danger",
  } as const;

  return (
    <Badge variant={variants[status] || "outline"} className="uppercase text-[10px]">
      {status.replace('_', ' ')}
    </Badge>
  );
}