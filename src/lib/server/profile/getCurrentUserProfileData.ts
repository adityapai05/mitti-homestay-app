import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export interface CurrentUserProfileData {
  name: string;
  image: string | null;
  about: string | null;
  languages: string[];
  contactPhone: string | null;
  role: "USER" | "HOST" | "ADMIN";
}

export async function getCurrentUserProfileData(): Promise<CurrentUserProfileData | null> {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return {
    name: user.name,
    image: user.image ?? null,
    about: user.about ?? null,
    languages: user.languages ?? [],
    contactPhone: user.contactPhone ?? null,
    role: user.role,
  };
}
