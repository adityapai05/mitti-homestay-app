"use client";

export default function ProfileHeader() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold text-mitti-dark-brown">
        Public profile
      </h1>

      <p className="text-sm text-mitti-dark-brown/70 max-w-xl">
        This information is visible to guests on MITTI. Share details that help
        guests know you better and get in touch when needed.
      </p>
    </div>
  );
}
