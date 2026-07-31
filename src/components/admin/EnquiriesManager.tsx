"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { toggleEnquiryReadAction } from "@/server/actions/adminActions";

type Enquiry = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export function EnquiriesManager({ enquiries }: { enquiries: Enquiry[] }) {
  const [pending, startTransition] = useTransition();

  function toggle(id: string, isRead: boolean) {
    startTransition(async () => {
      const result = await toggleEnquiryReadAction(id, isRead);
      if (!result.ok) toast.error(result.error);
    });
  }

  const columns: Column<Enquiry>[] = [
    {
      header: "Contact",
      cell: (e) => (
        <div>
          <p className="font-medium">{e.name}</p>
          <p className="text-xs text-muted-foreground">
            {e.phone}
            {e.email ? ` · ${e.email}` : ""}
          </p>
        </div>
      ),
    },
    { header: "Message", cell: (e) => <p className="max-w-md text-sm">{e.message}</p> },
    {
      header: "Received",
      cell: (e) => new Date(e.createdAt).toLocaleString("en-IN"),
    },
    {
      header: "Status",
      cell: (e) => (
        <Badge variant={e.isRead ? "secondary" : "default"}>{e.isRead ? "Read" : "New"}</Badge>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={enquiries}
      emptyMessage="No enquiries yet."
      actions={(e) => (
        <Button size="sm" variant="outline" disabled={pending} onClick={() => toggle(e.id, !e.isRead)}>
          Mark as {e.isRead ? "Unread" : "Read"}
        </Button>
      )}
    />
  );
}
