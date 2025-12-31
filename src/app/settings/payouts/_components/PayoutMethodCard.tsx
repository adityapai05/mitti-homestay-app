import { Wallet, Landmark } from "lucide-react";

type PayoutMethodType = "UPI" | "BANK";

interface Props {
  selectedMethod: PayoutMethodType | null;
  onSelect: (method: PayoutMethodType) => void;
  disabled?: boolean;
}

export default function PayoutMethodCard({
  selectedMethod,
  onSelect,
  disabled = false,
}: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-medium text-mitti-dark-brown">
        How you’ll get paid
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* UPI */}
        <MethodCard
          title="UPI"
          description="Receive payouts directly to your UPI ID"
          icon={<Wallet size={20} />}
          selected={selectedMethod === "UPI"}
          disabled={disabled}
          onClick={() => onSelect("UPI")}
        />

        {/* Bank */}
        <MethodCard
          title="Bank transfer"
          description="Receive payouts to your bank account"
          icon={<Landmark size={20} />}
          selected={selectedMethod === "BANK"}
          disabled={disabled}
          onClick={() => onSelect("BANK")}
        />
      </div>

      {disabled && (
        <p className="text-xs text-mitti-dark-brown/60 max-w-lg">
          To change your payout method, edit your payout details below.
        </p>
      )}
    </section>
  );
}

/* ----------------------------- Card ----------------------------- */

interface CardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}

function MethodCard({
  title,
  description,
  icon,
  selected,
  disabled,
  onClick,
}: CardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`
        relative rounded-xl border px-5 py-4 text-left transition
        ${
          selected
            ? "border-mitti-brown bg-mitti-beige"
            : "border-mitti-khaki hover:bg-mitti-beige/60"
        }
        ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-mitti-dark-brown">{icon}</div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-mitti-dark-brown">{title}</p>
          <p className="text-xs text-mitti-dark-brown/70">{description}</p>
        </div>
      </div>

      {selected && (
        <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-mitti-brown" />
      )}
    </button>
  );
}
