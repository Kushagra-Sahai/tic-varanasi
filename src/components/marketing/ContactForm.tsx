"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactEnquirySchema, type ContactEnquiryInput } from "@/lib/validation/contact";
import { submitContactAction } from "@/server/actions/contactActions";

export function ContactForm() {
  const [pending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactEnquiryInput>({ resolver: zodResolver(contactEnquirySchema) });

  function onSubmit(data: ContactEnquiryInput) {
    setError(null);
    startTransition(async () => {
      const result = await submitContactAction(data);
      if (result.ok) {
        setSubmitted(true);
        reset();
      } else {
        setError(result.error);
      }
    });
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center">
        <CheckCircle2 className="size-12 text-green-600" />
        <h3 className="mt-3 font-heading text-lg font-semibold">Message Sent</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Thank you for reaching out — our team will get back to you shortly.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => setSubmitted(false)}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" className="mt-1.5" {...register("name")} />
        {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" className="mt-1.5" {...register("phone")} />
        {errors.phone && <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>}
      </div>
      <div>
        <Label htmlFor="email">Email (optional)</Label>
        <Input id="email" type="email" className="mt-1.5" {...register("email")} />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={4} className="mt-1.5" {...register("message")} />
        {errors.message && <p className="mt-1 text-sm text-destructive">{errors.message.message}</p>}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={pending} className="w-full bg-brand-gradient text-white">
        {pending && <Loader2 className="size-4 animate-spin" />}
        Send Message
      </Button>
    </form>
  );
}
