"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import ProfileHeader from "./_components/ProfileHeader";
import ProfilePhotoSection from "./_components/ProfilePhotoSection";
import BasicInfoSection from "./_components/BasicInfoSection";
import LanguagesSection from "./_components/LanguagesSection";
import ContactPhoneSection from "./_components/ContactPhoneSection";

interface ProfileData {
  name: string;
  image: string | null;
  about: string | null;
  languages: string[];
  contactPhone: string | null;
  role: "USER" | "HOST" | "ADMIN";
}

export default function ProfilePage() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/auth/user");
        if (!res.ok) throw new Error();

        const user = await res.json();

        setData({
          name: user.name,
          image: user.image ?? null,
          about: user.about ?? null,
          languages: user.languages ?? [],
          contactPhone: user.contactPhone ?? null,
          role: user.role,
        });
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-6 w-40 bg-mitti-khaki/30 rounded" />
        <div className="h-24 bg-mitti-khaki/20 rounded-xl" />
        <div className="h-40 bg-mitti-khaki/20 rounded-xl" />
        <div className="h-32 bg-mitti-khaki/20 rounded-xl" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      <ProfileHeader />

      {/* Two-column main profile layout */}
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 items-start">
        {/* Left: Profile photo */}
        <ProfilePhotoSection
          image={data.image}
          onUpdated={(image) => setData((d) => d && { ...d, image })}
        />

        {/* Right: Info stack */}
        <div className="space-y-6">
          <BasicInfoSection
            name={data.name}
            about={data.about}
            onUpdated={(updates) => setData((d) => d && { ...d, ...updates })}
          />

          <LanguagesSection
            languages={data.languages}
            onUpdated={(languages) => setData((d) => d && { ...d, languages })}
          />

          <ContactPhoneSection
            phone={data.contactPhone}
            role={data.role}
            onUpdated={(contactPhone) =>
              setData((d) => d && { ...d, contactPhone })
            }
          />
        </div>
      </div>
    </div>
  );
}
