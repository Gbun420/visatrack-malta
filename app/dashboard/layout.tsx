import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import ErrorBoundary from "@/components/error-boundary";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <div className="pl-64 transition-all duration-300">
                <DashboardHeader />
                <main className="p-6">
                  <ErrorBoundary>
                    {children}
                  </ErrorBoundary>
                </main>
            </div>
        </div>
    );
}
