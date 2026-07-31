import { getSettings } from "@/server/services/settingsService";
import { SettingsManager } from "@/components/admin/SettingsManager";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Site Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Contact details shown across the public website.
      </p>
      <div className="mt-6 max-w-xl">
        <SettingsManager settings={settings} />
      </div>
    </div>
  );
}
