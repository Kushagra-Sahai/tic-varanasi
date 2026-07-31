"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSettingsAction } from "@/server/actions/adminActions";

type Settings = {
  phonePrimary: string;
  phoneSecondary: string;
  landline: string;
  email: string;
  whatsapp: string;
  address: string;
  yearsInService: string;
};

const FIELDS: { key: keyof Settings; label: string; settingKey: string }[] = [
  { key: "phonePrimary", label: "Primary Phone", settingKey: "site_phone_primary" },
  { key: "phoneSecondary", label: "Secondary Phone", settingKey: "site_phone_secondary" },
  { key: "landline", label: "Landline", settingKey: "site_landline" },
  { key: "email", label: "Email", settingKey: "site_email" },
  { key: "whatsapp", label: "WhatsApp Number (with country code)", settingKey: "site_whatsapp" },
  { key: "address", label: "Address", settingKey: "site_address" },
  { key: "yearsInService", label: "Years in Service", settingKey: "years_in_service" },
];

export function SettingsManager({ settings }: { settings: Settings }) {
  const [values, setValues] = useState(settings);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const payload = Object.fromEntries(
        FIELDS.map((f) => [f.settingKey, values[f.key]]),
      );
      const result = await updateSettingsAction(payload);
      if (result.ok) toast.success("Settings updated");
      else toast.error(result.error);
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
      {FIELDS.map((f) => (
        <div key={f.key}>
          <Label htmlFor={f.key}>{f.label}</Label>
          <Input
            id={f.key}
            className="mt-1.5"
            value={values[f.key]}
            onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
          />
        </div>
      ))}
      <Button type="submit" disabled={pending} className="bg-brand-gradient text-white">
        Save Settings
      </Button>
    </form>
  );
}
