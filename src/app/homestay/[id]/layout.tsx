export default function HomestayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`min-h-screen bg-mitti-cream text-mitti-dark-brown`}>
      <main className="max-w-7xl mx-auto p-4">{children}</main>
    </div>
  );
}
