import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

import ProfileHeader, { HostData } from "./_components/ProfileHeader";
import AboutSection from "./_components/AboutSection";
import LanguagesSection from "./_components/LanguagesSection";
import HostHighlights from "./_components/HostHighlights";
import ReviewsPreview from "./_components/ReviewsPreview";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      hostProfile: true,
      homestays: {
        select: {
          rating: true,
          reviews: {
            take: 2,
            orderBy: { createdAt: "desc" },
            include: {
              user: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      },
      bookings: {
        where: { status: "COMPLETED" },
        select: { id: true },
      },
    },
  });

  if (!user || !user.isActive) {
    notFound();
  }

  const isSelf = currentUser?.id === user.id;
  const isHost = user.role === "HOST";

  let hostData: HostData = null;

  type RecentReview = {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    user: {
      name: string;
      image: string | null;
    };
  };

  let recentReviews: RecentReview[] = [];

  if (isHost) {
    const homestaysCount = user.homestays.length;

    const ratings = user.homestays.map((h) => h.rating || 0);
    const totalRating = ratings.reduce((a, b) => a + b, 0);

    hostData = {
      verificationStatus: user.hostProfile?.verificationStatus ?? "PENDING",
      hostingSince: user.createdAt.getFullYear(),
      homestaysCount,
      guestsHosted: user.bookings.length,
      averageRating:
        homestaysCount > 0
          ? Number((totalRating / homestaysCount).toFixed(2))
          : null,
    };

    recentReviews = user.homestays.flatMap((h) => h.reviews);
  }

  return (
    <section className="space-y-12">
      <ProfileHeader user={user} hostData={hostData} isSelf={isSelf} />

      <AboutSection about={user.about} isSelf={isSelf} role={user.role} />

      <LanguagesSection
        languages={user.languages}
        isSelf={isSelf}
        role={user.role}
      />

      {isHost && hostData && <HostHighlights hostData={hostData} />}

      {isHost && recentReviews.length > 0 && (
        <ReviewsPreview reviews={recentReviews} />
      )}
    </section>
  );
}
