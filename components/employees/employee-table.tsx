"use client";

import { Employee } from "@/types";
import { format, parseISO } from "date-fns";
import { VisaStatusBadge, EmploymentStatusBadge } from "./status-badge";
import { motion } from "framer-motion";
import { Calendar, Eye, User, Flag } from "lucide-react";

interface EmployeeTableProps {
  employees: Employee[];
}

export function EmployeeTable({ employees }: EmployeeTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-50">
            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Full Name</th>
            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Passport #</th>
            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Nationality</th>
            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Visa Type</th>
            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Expiry</th>
            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Documentation Status</th>
            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {employees.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">
                No active records found matching your criteria.
              </td>
            </tr>
          ) : (
            employees.map((employee, idx) => {
              const activeVisa = employee.visas?.find(
                (v) => v.status === "valid" || v.status === "active"
              );

              return (
                <motion.tr
                  key={employee.id}
                  className="group hover:bg-slate-50 transition-all duration-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-none mb-1">{employee.first_name} {employee.last_name}</p>
                        <p className="text-[11px] font-medium text-slate-400">{employee.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-mono text-[13px] text-slate-600 font-medium uppercase tracking-tight">
                      {employee.passport_number}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-bold text-slate-700">{employee.nationality || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[13px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-tight">
                      {activeVisa?.visa_type || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-[13px] font-bold text-slate-700">
                        {activeVisa?.expiry_date
                          ? format(parseISO(activeVisa.expiry_date), "MMM dd, yyyy")
                          : "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <VisaStatusBadge expiryDate={activeVisa?.expiry_date} />
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:text-primary transition-colors underline underline-offset-4"
                      aria-label={`View details for ${employee.first_name} ${employee.last_name}`}
                    >
                      <Eye className="w-3 h-3" />
                      View Details
                    </button>
                  </td>
                </motion.tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
