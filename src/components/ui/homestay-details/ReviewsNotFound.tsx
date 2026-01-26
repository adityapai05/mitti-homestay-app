import { MessageSquare } from "lucide-react";

interface ReviewsNotFoundProps {
  homestay: string;
}

const ReviewsNotFound: React.FC<ReviewsNotFoundProps> = ({ homestay }) => {
  return (
    <section className="py-10 px-6 bg-mitti-cream shadow-sm">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-mitti-dark-brown mb-6">
          Reviews
        </h2>
        <div className="flex flex-col items-center text-center p-6">
          <MessageSquare size={40} className="text-mitti-olive mb-4" />
          <h3 className="text-xl font-semibold text-mitti-dark-brown">
            No Reviews Yet
          </h3>
          <p className="text-mitti-dark-brown/80 text-base mt-2 max-w-md">
            Be the first to share your experience at{" "}
            {homestay || "this homestay"} after your stay!
          </p>
        </div>
      </div>
    </section>
  );
};

export default ReviewsNotFound;
