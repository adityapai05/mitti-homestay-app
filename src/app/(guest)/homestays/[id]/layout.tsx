export default function HomestayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-mitti-beige text-mitti-dark-brown">
      <main className="max-w-7xl mx-auto px-4 pt-6">{children}</main>
    </div>
  );
}
