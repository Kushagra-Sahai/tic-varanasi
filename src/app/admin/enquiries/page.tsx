import { listContactEnquiries } from "@/server/services/contactService";
import { EnquiriesManager } from "@/components/admin/EnquiriesManager";

export default async function AdminEnquiriesPage() {
  const enquiries = await listContactEnquiries();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Contact Enquiries</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Messages submitted through the website contact form.
      </p>
      <div className="mt-6">
        <EnquiriesManager enquiries={enquiries} />
      </div>
    </div>
  );
}
