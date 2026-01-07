export default function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-mitti-beige">
      {children}
    </div>
  );
}
