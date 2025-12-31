"use client";

import { useState } from "react";

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

export default function PayoutDetailsForm({
  method,
  initialValues,
  onCancel,
  onSuccess,
}: Props) {
  const [form, setForm] = useState({
    accountHolderName: initialValues?.accountHolderName ?? "",
    upiId: initialValues?.upiId ?? "",
    bankName: initialValues?.bankName ?? "",
    accountNo: initialValues?.accountNo ?? "",
    ifsc: initialValues?.ifsc ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate() {
    if (!form.accountHolderName.trim()) {
      return "Account holder name is required";
    }

    if (method === "UPI") {
      if (!form.upiId.includes("@")) {
        return "Enter a valid UPI ID";
      }
    }

    if (method === "BANK") {
      if (!form.bankName || !form.accountNo || !form.ifsc) {
        return "All bank details are required";
      }
    }

    return null;
  }

  async function handleSubmit() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/host/payouts/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          accountHolderName: form.accountHolderName,
          upiId: method === "UPI" ? form.upiId : undefined,
          bankName: method === "BANK" ? form.bankName : undefined,
          accountNo: method === "BANK" ? form.accountNo : undefined,
          ifsc: method === "BANK" ? form.ifsc : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error();
      }

      const updated = await res.json();
      onSuccess(updated);
    } catch {
      setError("Failed to save payout details");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-medium text-mitti-dark-brown">
        Payout details
      </h2>

      <div className="rounded-xl border border-mitti-khaki bg-mitti-cream px-5 py-5 space-y-5">
        <Field
          label="Account holder name"
          value={form.accountHolderName}
          onChange={(v) => update("accountHolderName", v)}
          placeholder="As per bank records"
        />

        {method === "UPI" && (
          <Field
            label="UPI ID"
            value={form.upiId}
            onChange={(v) => update("upiId", v)}
            placeholder="example@upi"
          />
        )}

        {method === "BANK" && (
          <>
            <Field
              label="Bank name"
              value={form.bankName}
              onChange={(v) => update("bankName", v)}
            />

            <Field
              label="Account number"
              value={form.accountNo}
              onChange={(v) => update("accountNo", v)}
            />

            <Field
              label="IFSC code"
              value={form.ifsc}
              onChange={(v) => update("ifsc", v)}
            />
          </>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-lg bg-mitti-brown px-5 py-2 text-sm font-medium text-white hover:bg-mitti-dark-brown disabled:opacity-60 cursor-pointer"
          >
            {saving ? "Saving…" : "Save payout details"}
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

/* ----------------------------- Field ----------------------------- */

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-mitti-dark-brown/90">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-lg border border-mitti-khaki bg-white px-3 py-2 text-sm text-mitti-dark-brown focus:outline-none focus:ring-2 focus:ring-mitti-brown/20"
      />
    </div>
  );
}
