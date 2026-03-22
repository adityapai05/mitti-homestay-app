"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createSchema as payoutCreateSchema } from "@/lib/validation/payoutSchemas";

type PayoutMethodType = "UPI" | "BANK";

interface HostPayoutAccount {
  method: PayoutMethodType;
  upiId?: string;
  bankName?: string;
  accountNo?: string;
  ifsc?: string;
  accountHolderName: string;
}

interface Props {
  method: PayoutMethodType;
  initialValues: HostPayoutAccount | null;
  onCancel: () => void;
  onSuccess: (account: HostPayoutAccount) => void;
}

const formSchema = z
  .object({
    accountHolderName: z.string().trim().min(2).max(100),
    upiId: z.string().trim().optional(),
    bankName: z.string().trim().optional(),
    accountNo: z.string().trim().optional(),
    ifsc: z.string().trim().optional(),
  })
  .strict();

type FormValues = z.infer<typeof formSchema>;

export default function PayoutDetailsForm({
  method,
  initialValues,
  onCancel,
  onSuccess,
}: Props) {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      accountHolderName: initialValues?.accountHolderName ?? "",
      upiId: initialValues?.upiId ?? "",
      bankName: initialValues?.bankName ?? "",
      accountNo: initialValues?.accountNo ?? "",
      ifsc: initialValues?.ifsc ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);

    const payload =
      method === "UPI"
        ? {
            method,
            accountHolderName: values.accountHolderName,
            upiId: values.upiId || null,
            bankName: null,
            accountNo: null,
            ifsc: null,
          }
        : {
            method,
            accountHolderName: values.accountHolderName,
            upiId: null,
            bankName: values.bankName || null,
            accountNo: values.accountNo || null,
            ifsc: values.ifsc || null,
          };

    const parsedPayload = payoutCreateSchema.safeParse(payload);
    if (!parsedPayload.success) {
      setError(parsedPayload.error.issues[0]?.message ?? "Invalid payout details");
      return;
    }

    try {
      const res = await fetch("/api/host/payouts/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedPayload.data),
      });

      if (!res.ok) {
        throw new Error();
      }

      const updated = await res.json();
      onSuccess(updated);
    } catch {
      setError("Failed to save payout details");
    }
  });

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-medium text-mitti-dark-brown">
        Payout details
      </h2>

      <div className="rounded-xl border border-mitti-khaki bg-mitti-cream px-5 py-5 space-y-5">
        <Field
          label="Account holder name"
          error={errors.accountHolderName?.message}
        >
          <input
            {...register("accountHolderName")}
            className="rounded-lg border border-mitti-khaki bg-white px-3 py-2 text-sm text-mitti-dark-brown focus:outline-none focus:ring-2 focus:ring-mitti-brown/20"
          />
        </Field>

        {method === "UPI" && (
          <Field label="UPI ID" error={errors.upiId?.message}>
            <input
              {...register("upiId")}
              className="rounded-lg border border-mitti-khaki bg-white px-3 py-2 text-sm text-mitti-dark-brown focus:outline-none focus:ring-2 focus:ring-mitti-brown/20"
            />
          </Field>
        )}

        {method === "BANK" && (
          <>
            <Field label="Bank name" error={errors.bankName?.message}>
              <input
                {...register("bankName")}
                className="rounded-lg border border-mitti-khaki bg-white px-3 py-2 text-sm text-mitti-dark-brown focus:outline-none focus:ring-2 focus:ring-mitti-brown/20"
              />
            </Field>

            <Field label="Account number" error={errors.accountNo?.message}>
              <input
                {...register("accountNo")}
                className="rounded-lg border border-mitti-khaki bg-white px-3 py-2 text-sm text-mitti-dark-brown focus:outline-none focus:ring-2 focus:ring-mitti-brown/20"
              />
            </Field>

            <Field label="IFSC code" error={errors.ifsc?.message}>
              <input
                {...register("ifsc")}
                className="rounded-lg border border-mitti-khaki bg-white px-3 py-2 text-sm text-mitti-dark-brown focus:outline-none focus:ring-2 focus:ring-mitti-brown/20"
              />
            </Field>
          </>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || !isValid}
            className="rounded-lg bg-mitti-brown px-5 py-2 text-sm font-medium text-white hover:bg-mitti-dark-brown disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? "Saving..." : "Save payout details"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-mitti-dark-brown/90 hover:underline cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-mitti-dark-brown/90">{label}</label>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}