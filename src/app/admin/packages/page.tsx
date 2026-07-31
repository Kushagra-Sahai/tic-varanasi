import { db } from "@/lib/db";
import { PackagesManager } from "@/components/admin/PackagesManager";

export default async function AdminPackagesPage() {
  const packages = await db.package.findMany({
    include: { images: { orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Tour Packages</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage pricing, images and publishing status for tour packages.
      </p>
      <div className="mt-6">
        <PackagesManager
          packages={packages.map((p) => ({
            ...p,
            price: Number(p.price),
            discountPrice: p.discountPrice != null ? Number(p.discountPrice) : null,
          }))}
        />
      </div>
    </div>
  );
}
