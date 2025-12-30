import StayTabs from "./_components/StayTabs";

export default function MyStaysPage() {
  return (
    <main className="min-h-screen bg-mitti-beige">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <header>
          <h1 className="text-2xl font-semibold text-mitti-dark-brown">
            My Bookings
          </h1>
          <p className="text-sm text-mitti-dark-brown/60 mt-1">
            A record of the places you have stayed or will stay
          </p>
        </header>

        <StayTabs />
      </div>
    </main>
  );
}
