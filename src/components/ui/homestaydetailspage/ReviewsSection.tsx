"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import axios from "axios";
import { Avatar, AvatarImage } from "../prebuilt-components/avatar";

interface Review {
  id: string;
  user: { id: string; name: string; image: string | null };
  rating: number;
  comment?: string;
  createdAt: string;
}

interface ReviewsSectionProps {
  homestayId: string;
}

const sampleReviews: Review[] = [
  {
    id: "1",
    user: { id: "u1", name: "Aditi Sharma", image: null },
    rating: 5,
    comment:
      "Amazing stay! The host was very welcoming and the food was authentic.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    user: { id: "u2", name: "Rahul Verma", image: null },
    rating: 4,
    comment:
      "Beautiful place, very peaceful. Would recommend for a weekend getaway.",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: "3",
    user: { id: "u3", name: "Sneha Kapoor", image: null },
    rating: 5,
    comment:
      "Loved the cultural experience and the local guide was very helpful!",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
  },
];

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ homestayId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/reviews/${homestayId}`
        );

        if (response.data.reviews.length > 0) {
          setReviews(response.data.reviews);
        } else {
          // fallback to sample data
          setReviews(sampleReviews);
        }
      } catch (error) {
        console.error("[GET reviews/[homestayId]]", error);
        setReviews(sampleReviews); // fallback if API fails
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [homestayId]);

  if (loading) {
    return (
      <div className="py-8 px-4 text-mitti-dark-brown">Loading reviews...</div>
    );
  }

  return (
    <section className="py-8 px-4 bg-mitti-cream">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-mitti-dark-brown mb-4">
          Reviews
        </h2>
        {reviews.length === 0 ? (
          <p className="text-mitti-dark-brown">
            Be the first to review this homestay!
          </p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex gap-4 border-b border-mitti-beige pb-4"
              >
                <div className="relative w-12 h-12">
                  <Avatar>
                    <AvatarImage
                      src={review.user.image || '/default-avatar.png'}
                      alt={`Reviewer ${review.user.name}`}
                      className="rounded-full object-cover"
                    />
                  </Avatar>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-mitti-dark-brown font-medium">
                      {review.user.name}
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < review.rating
                              ? "text-mitti-brown fill-mitti-brown"
                              : "text-mitti-muted"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-mitti-dark-brown">{review.comment}</p>
                  <p className="text-sm text-mitti-muted">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
