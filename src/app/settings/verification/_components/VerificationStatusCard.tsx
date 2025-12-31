import { BadgeCheck, Clock, XCircle } from "lucide-react";

type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

interface Props {
  status: VerificationStatus;
}

export default function VerificationStatusCard({ status }: Props) {
  const config = getStatusConfig(status);

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-medium text-mitti-dark-brown">
        Verification status
      </h2>

      <div
        className={`
          flex items-start gap-4 rounded-xl border px-5 py-4
          ${config.container}
        `}
      >
        <div className={config.iconColor}>{config.icon}</div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-mitti-dark-brown">
            {config.title}
          </p>
          <p className="text-xs text-mitti-dark-brown/70 max-w-md">
            {config.description}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Helpers ----------------------------- */

function getStatusConfig(status: VerificationStatus) {
  switch (status) {
    case "VERIFIED":
      return {
        title: "Verified",
        description:
          "Your host profile has been verified. You can list homestays and receive bookings on MITTI.",
        icon: <BadgeCheck size={20} />,
        iconColor: "text-mitti-brown",
        container: "bg-mitti-beige border-mitti-khaki",
      };

    case "REJECTED":
      return {
        title: "Verification rejected",
        description:
          "Your verification was not approved. You may be asked to resubmit details in the future.",
        icon: <XCircle size={20} />,
        iconColor: "text-red-600",
        container: "bg-red-50 border-red-200",
      };

    default:
      return {
        title: "Verification pending",
        description:
          "Your host profile is under review. Verification usually takes a short time.",
        icon: <Clock size={20} />,
        iconColor: "text-mitti-dark-brown",
        container: "bg-mitti-cream border-mitti-khaki",
      };
  }
}
