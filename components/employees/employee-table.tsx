"use client";

import { Employee } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { VisaStatusBadge, EmploymentStatusBadge } from "./status-badge";

interface EmployeeTableProps {
  employees: Employee[];
}

export function EmployeeTable({ employees }: EmployeeTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Passport</TableHead>
            <TableHead>Nationality</TableHead>
            <TableHead>Visa Type</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Visa Status</TableHead>
            <TableHead>Employment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No employees found.
              </TableCell>
            </TableRow>
          ) : (
            employees.map((employee) => {
              const activeVisa = employee.visas?.find(
                (v) => v.application_status === "active"
              );

              return (
                <TableRow key={employee.id}>
                  <TableCell className="font-semibold text-secondary">
                    {employee.first_name} {employee.last_name}
                  </TableCell>
                  <TableCell className="font-mono text-xs uppercase tracking-wider">
                    {employee.passport_number}
                  </TableCell>
                  <TableCell>{employee.nationality}</TableCell>
                  <TableCell className="text-xs">
                    {activeVisa?.visa_type || "N/A"}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {activeVisa?.expiry_date 
                      ? format(parseISO(activeVisa.expiry_date), "dd/MM/yyyy")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <VisaStatusBadge expiryDate={activeVisa?.expiry_date} />
                  </TableCell>
                  <TableCell>
                    <EmploymentStatusBadge status={employee.status} />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
