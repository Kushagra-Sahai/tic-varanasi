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
import { packageUpsertSchema } from "@/lib/validation/package";
import { upsertPackageAction, deletePackageAction } from "@/server/actions/adminActions";

const formSchema = packageUpsertSchema.extend({ imagesText: z.string().optional() });
type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

type Pkg = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  durationDays: number;
  durationNights: number;
  price: number;
  discountPrice: number | null;
  maxGroupSize: number;
  isActive: boolean;
  isFeatured: boolean;
  images: { url: string; alt: string }[];
};

export function PackagesManager({ packages }: { packages: Pkg[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Pkg | null>(null);
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
      title: "",
      summary: "",
      description: "",
      durationDays: 1,
      durationNights: 0,
      price: 0,
      maxGroupSize: 20,
      isActive: true,
      isFeatured: false,
      imagesText: "",
    });
    setOpen(true);
  }

  function openEdit(p: Pkg) {
    setEditing(p);
    reset({
      id: p.id,
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      description: p.description,
      durationDays: p.durationDays,
      durationNights: p.durationNights,
      price: p.price,
      discountPrice: p.discountPrice ?? undefined,
      maxGroupSize: p.maxGroupSize,
      isActive: p.isActive,
      isFeatured: p.isFeatured,
      imagesText: p.images.map((i) => i.url).join("\n"),
    });
    setOpen(true);
  }

  function onSubmit(data: FormOutput) {
    startTransition(async () => {
      const result = await upsertPackageAction(data);
      if (result.ok) {
        toast.success(editing ? "Package updated" : "Package created");
        setOpen(false);
      } else {
        toast.error(result.error);
      }
    });
  }

  function onDelete(id: string) {
    if (!confirm("Delete this package? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await deletePackageAction(id);
      if (result.ok) toast.success("Package deleted");
      else toast.error(result.error);
    });
  }

  const columns: Column<Pkg>[] = [
    {
      header: "Package",
      cell: (p) => (
        <div className="flex items-center gap-3">
          {p.images[0] && (
            <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
              <Image src={p.images[0].url} alt={p.images[0].alt} fill className="object-cover" />
            </div>
          )}
          <div>
            <p className="font-medium">{p.title}</p>
            <p className="text-xs text-muted-foreground">
              {p.durationDays}D / {p.durationNights}N
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Price",
      cell: (p) => `₹${Number(p.discountPrice ?? p.price).toLocaleString("en-IN")}`,
    },
    {
      header: "Status",
      cell: (p) => (
        <div className="flex gap-1.5">
          <Badge variant={p.isActive ? "default" : "secondary"}>
            {p.isActive ? "Active" : "Inactive"}
          </Badge>
          {p.isFeatured && <Badge className="bg-brand-gold text-brand-slate">Featured</Badge>}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={openCreate} className="bg-brand-gradient text-white">
          <Plus className="size-4" /> Add Package
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={packages}
        actions={(p) => (
          <div className="flex justify-end gap-2">
            <Button size="icon" variant="ghost" onClick={() => openEdit(p)}>
              <Pencil className="size-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => onDelete(p.id)}>
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        )}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Package" : "Add Package"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" className="mt-1.5" {...register("title")} />
                {errors.title && <p className="mt-1 text-sm text-destructive">{errors.title.message}</p>}
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" className="mt-1.5" {...register("slug")} />
                {errors.slug && <p className="mt-1 text-sm text-destructive">{errors.slug.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="summary">Summary</Label>
              <Textarea id="summary" rows={2} className="mt-1.5" {...register("summary")} />
              {errors.summary && <p className="mt-1 text-sm text-destructive">{errors.summary.message}</p>}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={4} className="mt-1.5" {...register("description")} />
              {errors.description && (
                <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              <div>
                <Label htmlFor="durationDays">Days</Label>
                <Input id="durationDays" type="number" className="mt-1.5" {...register("durationDays")} />
              </div>
              <div>
                <Label htmlFor="durationNights">Nights</Label>
                <Input id="durationNights" type="number" className="mt-1.5" {...register("durationNights")} />
              </div>
              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input id="price" type="number" className="mt-1.5" {...register("price")} />
              </div>
              <div>
                <Label htmlFor="discountPrice">Discount Price</Label>
                <Input id="discountPrice" type="number" className="mt-1.5" {...register("discountPrice")} />
              </div>
              <div>
                <Label htmlFor="maxGroupSize">Max Group</Label>
                <Input id="maxGroupSize" type="number" className="mt-1.5" {...register("maxGroupSize")} />
              </div>
            </div>

            <div>
              <Label htmlFor="imagesText">Image URLs (one per line)</Label>
              <Textarea id="imagesText" rows={3} className="mt-1.5" {...register("imagesText")} />
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
              {editing ? "Save Changes" : "Create Package"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
