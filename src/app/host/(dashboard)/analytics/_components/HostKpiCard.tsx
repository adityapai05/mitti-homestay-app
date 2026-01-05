type HostKpiCardProps = {
  label: string;
  value: string | number;
};

export default function HostKpiCard({ label, value }: HostKpiCardProps) {
  return (
    <div className="bg-white rounded-xl border border-mitti-khaki p-4 flex flex-col justify-between">
      <p className="text-sm text-mitti-dark-brown/70">{label}</p>
      <p className="text-2xl font-semibold text-mitti-dark-brown">{value}</p>
    </div>
  );
}
