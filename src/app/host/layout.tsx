import HostNavbar from "@/components/host/HostNavbar";

export default function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-mitti-beige">
      <HostNavbar />
      {children}
    </div>
  );
}
