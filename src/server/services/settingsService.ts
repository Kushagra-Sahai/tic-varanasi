import "server-only";
import { readRecord } from "@/lib/jsondb";
import type { Settings } from "@/lib/entities";
import { COMPANY } from "@/lib/constants";

export async function getSettings() {
  const map = (await readRecord<Settings>("settings")) ?? {};
  return {
    phonePrimary: map.site_phone_primary ?? COMPANY.primaryPhone,
    phoneSecondary: map.site_phone_secondary ?? COMPANY.phones[2],
    landline: map.site_landline ?? COMPANY.phones[0],
    email: map.site_email ?? COMPANY.email,
    whatsapp: map.site_whatsapp ?? `91${COMPANY.primaryPhone}`,
    address: map.site_address ?? COMPANY.address,
    yearsInService: map.years_in_service ?? "25",
  };
}
