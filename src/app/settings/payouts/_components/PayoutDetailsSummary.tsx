import { Pencil } from "lucide-react";

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
  account: HostPayoutAccount;
  onEdit: () => void;
}

export default function PayoutDetailsSummary({ account, onEdit }: Props) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-mitti-dark-brown">
          Payout details
        </h2>

        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1.5 text-sm text-mitti-brown hover:underline"
        >
          <Pencil size={14} />
          Edit
        </button>
      </div>

      <div className="rounded-xl border border-mitti-khaki bg-mitti-cream px-5 py-4 space-y-4">
        <DetailRow
          label="Payout method"
          value={account.method === "UPI" ? "UPI" : "Bank transfer"}
        />

        <DetailRow
          label="Account holder name"
          value={account.accountHolderName}
        />

        {account.method === "UPI" && account.upiId && (
          <DetailRow label="UPI ID" value={maskUpi(account.upiId)} />
        )}

        {account.method === "BANK" && (
          <>
            {account.bankName && (
              <DetailRow label="Bank name" value={account.bankName} />
            )}

            {account.accountNo && (
              <DetailRow
                label="Account number"
                value={maskAccountNumber(account.accountNo)}
              />
            )}

            {account.ifsc && (
              <DetailRow label="IFSC code" value={account.ifsc} />
            )}
          </>
        )}
      </div>
    </section>
  );
}

/* ----------------------------- Helpers ----------------------------- */

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-mitti-dark-brown/60">{label}</span>
      <span className="text-sm text-mitti-dark-brown">{value}</span>
    </div>
  );
}

function maskAccountNumber(accountNo: string) {
  if (accountNo.length <= 4) return accountNo;
  return `•••• ${accountNo.slice(-4)}`;
}

function maskUpi(upiId: string) {
  const [name, domain] = upiId.split("@");
  if (!domain) return upiId;
  return `${name.slice(0, 2)}•••@${domain}`;
}
