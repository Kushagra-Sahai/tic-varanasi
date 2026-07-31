"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { vehicleUpsertSchema } from "@/lib/validation/vehicle";
import { AC_TYPES } from "@/lib/constants";
import { upsertVehicleAction, deleteVehicleAction } from "@/server/actions/adminActions";

const formSchema = vehicleUpsertSchema.extend({
  imagesText: z.string().optional(),
  featuresText: z.string().optional(),
});
type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

type Vehicle = {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  category: { name: string };
  capacity: number;
  luggageCapacity: number;
  acType: string;
  transmission: string;
  basePrice: number;
  pricePerKm: number;
  driverAllowance: number;
  nightCharge: number;
  fuelType: string;
  description: string;
  isActive: boolean;
  isFeatured: boolean;
  images: { url: string; alt: string }[];
  features: { label: string }[];
};

type Category = { id: string; name: string };

export function VehiclesManager({
  vehicles,
  categories,
}: {
  vehicles: Vehicle[];
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInput, unknown, FormOutput>({ resolver: zodResolver(formSchema) });

  function openCreate() {
    setEditing(null);
    reset({
      slug: "",
      name: "",
      categoryId: categories[0]?.id ?? "",
      capacity: 4,
      luggageCapacity: 2,
      acType: "AC",
      transmission: "Manual",
      basePrice: 0,
      pricePerKm: 0,
      driverAllowance: 0,
      nightCharge: 0,
      fuelType: "Petrol",
      description: "",
      isActive: true,
      isFeatured: false,
      imagesText: "",
      featuresText: "",
    });
    setOpen(true);
  }

  function openEdit(v: Vehicle) {
    setEditing(v);
    reset({
      id: v.id,
      slug: v.slug,
      name: v.name,
      categoryId: v.categoryId,
      capacity: v.capacity,
      luggageCapacity: v.luggageCapacity,
      acType: v.acType as (typeof AC_TYPES)[number],
      transmission: v.transmission,
      basePrice: v.basePrice,
      pricePerKm: v.pricePerKm,
      driverAllowance: v.driverAllowance,
      nightCharge: v.nightCharge,
      fuelType: v.fuelType,
      description: v.description,
      isActive: v.isActive,
      isFeatured: v.isFeatured,
      imagesText: v.images.map((i) => i.url).join("\n"),
      featuresText: v.features.map((f) => f.label).join("\n"),
    });
    setOpen(true);
  }

  function onSubmit(data: FormOutput) {
    startTransition(async () => {
      const result = await upsertVehicleAction(data);
      if (result.ok) {
        toast.success(editing ? "Vehicle updated" : "Vehicle created");
        setOpen(false);
      } else {
        toast.error(result.error);
      }
    });
  }

  function onDelete(id: string) {
    if (!confirm("Delete this vehicle? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await deleteVehicleAction(id);
      if (result.ok) toast.success("Vehicle deleted");
      else toast.error(result.error);
    });
  }

  const columns: Column<Vehicle>[] = [
    {
      header: "Vehicle",
      cell: (v) => (
        <div className="flex items-center gap-3">
          {v.images[0] && (
            <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
              <Image src={v.images[0].url} alt={v.images[0].alt} fill className="object-cover" />
            </div>
          )}
          <div>
            <p className="font-medium">{v.name}</p>
            <p className="text-xs text-muted-foreground">{v.category.name}</p>
          </div>
        </div>
      ),
    },
    { header: "Base Price", cell: (v) => `₹${v.basePrice.toLocaleString("en-IN")}` },
    { header: "Per KM", cell: (v) => `₹${v.pricePerKm}` },
    {
      header: "Status",
      cell: (v) => (
        <div className="flex gap-1.5">
          <Badge variant={v.isActive ? "default" : "secondary"}>
            {v.isActive ? "Active" : "Inactive"}
          </Badge>
          {v.isFeatured && <Badge className="bg-brand-gold text-brand-slate">Featured</Badge>}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={openCreate} className="bg-brand-gradient text-white">
          <Plus className="size-4" /> Add Vehicle
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={vehicles}
        actions={(v) => (
          <div className="flex justify-end gap-2">
            <Button size="icon" variant="ghost" onClick={() => openEdit(v)}>
              <Pencil className="size-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => onDelete(v.id)}>
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        )}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Vehicle" : "Add Vehicle"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" className="mt-1.5" {...register("name")} />
                {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" className="mt-1.5" {...register("slug")} />
                {errors.slug && <p className="mt-1 text-sm text-destructive">{errors.slug.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="categoryId">Category</Label>
              <select
                id="categoryId"
                className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                {...register("categoryId")}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" type="number" className="mt-1.5" {...register("capacity")} />
              </div>
              <div>
                <Label htmlFor="luggageCapacity">Luggage</Label>
                <Input id="luggageCapacity" type="number" className="mt-1.5" {...register("luggageCapacity")} />
              </div>
              <div>
                <Label htmlFor="acType">AC Type</Label>
                <select
                  id="acType"
                  className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                  {...register("acType")}
                >
                  {AC_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="transmission">Transmission</Label>
                <Input id="transmission" className="mt-1.5" {...register("transmission")} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <Label htmlFor="basePrice">Base Price (₹)</Label>
                <Input id="basePrice" type="number" className="mt-1.5" {...register("basePrice")} />
              </div>
              <div>
                <Label htmlFor="pricePerKm">Per KM (₹)</Label>
                <Input id="pricePerKm" type="number" className="mt-1.5" {...register("pricePerKm")} />
              </div>
              <div>
                <Label htmlFor="driverAllowance">Driver Allowance</Label>
                <Input id="driverAllowance" type="number" className="mt-1.5" {...register("driverAllowance")} />
              </div>
              <div>
                <Label htmlFor="nightCharge">Night Charge</Label>
                <Input id="nightCharge" type="number" className="mt-1.5" {...register("nightCharge")} />
              </div>
            </div>

            <div>
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Input id="fuelType" className="mt-1.5" {...register("fuelType")} />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={3} className="mt-1.5" {...register("description")} />
              {errors.description && (
                <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="imagesText">Image URLs (one per line)</Label>
              <Textarea id="imagesText" rows={3} className="mt-1.5" {...register("imagesText")} />
            </div>

            <div>
              <Label htmlFor="featuresText">Features (one per line)</Label>
              <Textarea id="featuresText" rows={3} className="mt-1.5" {...register("featuresText")} />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register("isActive")} /> Active
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register("isFeatured")} /> Featured
              </label>
            </div>

            <Button type="submit" disabled={pending} className="w-full bg-brand-gradient text-white">
              {editing ? "Save Changes" : "Create Vehicle"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
