"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Home, Image as ImageIcon, CheckCircle } from "lucide-react";

const BecomeHostStartPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-mitti-beige flex items-center justify-center px-6">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight text-mitti-dark-brown">
            It’s easy to get started on MITTI
          </h1>

          <p className="mt-4 text-mitti-dark-brown max-w-md">
            Share your space with travelers looking for authentic rural stays.
            Creating your listing is simple and guided step by step.
          </p>

          <div className="mt-10 space-y-6">
            <StepItem
              icon={<Home size={20} />}
              number={1}
              title="Tell us about your place"
              description="Share basic details like location, type of stay, and how many guests you can host."
            />

            <StepItem
              icon={<ImageIcon size={20} />}
              number={2}
              title="Make it stand out"
              description="Add photos, a title, and a description that showcase your home’s character."
            />

            <StepItem
              icon={<CheckCircle size={20} />}
              number={3}
              title="Finish up and publish"
              description="Set your price, review everything, and publish your listing on MITTI."
            />
          </div>
        </div>

        <div className="bg-mitti-cream border border-mitti-khaki rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-mitti-dark-brown">
            Ready to become a host?
          </h2>

          <p className="mt-2 text-sm text-mitti-dark-brown">
            Most hosts finish their listing in about 10–15 minutes.
          </p>

          <button
            onClick={() => router.push("/host/homestays/create")}
            className="mt-6 inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg bg-mitti-brown text-white text-base font-medium hover:opacity-90 transition cursor-pointer"
          >
            Get started
            <ArrowRight size={18} />
          </button>

          <p className="mt-4 text-xs text-mitti-dark-brown text-center">
            You can edit your listing anytime before publishing
          </p>
        </div>
      </div>
    </div>
  );
};

function StepItem({
  icon,
  number,
  title,
  description,
}: {
  icon: React.ReactNode;
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 items-start">
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-mitti-khaki text-mitti-dark-brown">
        {icon}
      </div>

      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-mitti-dark-brown">
            Step {number}
          </span>
        </div>

        <h3 className="mt-1 font-medium text-mitti-dark-brown">
          {title}
        </h3>

        <p className="text-sm text-mitti-dark-brown max-w-md">
          {description}
        </p>
      </div>
    </div>
  );
}

export default BecomeHostStartPage;
