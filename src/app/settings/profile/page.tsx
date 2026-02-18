import { redirect } from "next/navigation";
import ProfilePageClient from "./_components/ProfilePageClient";
import { getCurrentUserProfileData } from "@/lib/server/profile/getCurrentUserProfileData";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const data = await getCurrentUserProfileData();
  if (!data) redirect("/login");

  return <ProfilePageClient initialData={data} />;
}
