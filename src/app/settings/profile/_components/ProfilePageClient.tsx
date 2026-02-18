"use client";

import { useState } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfilePhotoSection from "./ProfilePhotoSection";
import BasicInfoSection from "./BasicInfoSection";
import LanguagesSection from "./LanguagesSection";
import ContactPhoneSection from "./ContactPhoneSection";
import type { CurrentUserProfileData } from "@/lib/server/profile/getCurrentUserProfileData";

interface Props {
  initialData: CurrentUserProfileData;
}

export default function ProfilePageClient({ initialData }: Props) {
  const [data, setData] = useState(initialData);

  return (
    <div className="space-y-8">
      <ProfileHeader />

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 items-start">
        <ProfilePhotoSection
          image={data.image}
          onUpdated={(image) => setData((d) => ({ ...d, image }))}
        />

        <div className="space-y-6">
          <BasicInfoSection
            name={data.name}
            about={data.about}
            onUpdated={(updates) => setData((d) => ({ ...d, ...updates }))}
          />

          <LanguagesSection
            languages={data.languages}
            onUpdated={(languages) => setData((d) => ({ ...d, languages }))}
          />

          <ContactPhoneSection
            phone={data.contactPhone}
            role={data.role}
            onUpdated={(contactPhone) => setData((d) => ({ ...d, contactPhone }))}
          />
        </div>
      </div>
    </div>
  );
}
