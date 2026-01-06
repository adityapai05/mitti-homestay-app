import { STATUS_MESSAGES, STATUS_STYLES } from "./statusMessages";
import type { BookingStatus } from "./types";

interface BookingStatusHeaderProps {
  status: BookingStatus;
}

export default function BookingStatusHeader({
  status,
}: BookingStatusHeaderProps) {
  const message = STATUS_MESSAGES[status];

  return (
    <section className="rounded-xl border border-mitti-khaki bg-white p-5 space-y-2 shadow-sm">
      <div
        className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors ${STATUS_STYLES[status].badge} ${STATUS_STYLES[status].text}`}
      >
        {message.badge}
      </div>

      <h1 className="text-xl font-semibold text-mitti-dark-brown">
        {message.title}
      </h1>

      <p className="text-sm text-mitti-dark-brown/70 max-w-prose">
        {message.description}
      </p>
    </section>
  );
}
