import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SettingsPage } from "../shared/SettingsPage";

export default function UnifiedSettingsPage() {
  return (
    <DashboardLayout>
      <SettingsPage industryLabel="Consultants" />
    </DashboardLayout>
  );
}
