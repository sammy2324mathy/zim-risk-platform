import { DashboardShell } from "@/components/DashboardShell";
import { Suspense } from "react";

export default function DashboardRoute() {
  return (
    <Suspense fallback={<div>Establishing Terminal Connection...</div>}>
      <DashboardShell />
    </Suspense>
  );
}
