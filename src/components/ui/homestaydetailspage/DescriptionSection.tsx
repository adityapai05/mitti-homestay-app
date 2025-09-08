"use client";

import { Homestay } from "@/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/prebuilt-components/collapsible";
import { Button } from "@/components/ui/prebuilt-components/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DescriptionSectionProps {
  homestay: Homestay;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  homestay,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const words = homestay.description?.split(/\s+/) || [];
  const previewLength = 50;
  const previewText =
    words.length > previewLength
      ? words.slice(0, previewLength).join(" ") + "..."
      : homestay.description;

  return (
    <section className="py-10 px-6 bg-mitti-cream shadow-sm">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-mitti-dark-brown mb-4">
          About this Homestay
        </h2>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="text-mitti-dark-brown text-lg leading-relaxed mb-4">
            {isOpen ? (
              <div>{homestay.description || "No description provided."}</div>
            ) : (
              <div>{previewText || "No description provided."}</div>
            )}
          </div>
          {words.length > previewLength && (
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 bg-mitti-brown text-mitti-beige border-mitti-khaki",
                  "hover:bg-mitti-dark-brown cursor-pointer",
                  "transition-all duration-200 font-medium rounded-full"
                )}
                aria-label={isOpen ? "Show less" : "Read more"}
              >
                {isOpen ? (
                  <>
                    Show Less{" "}
                    <ChevronUp size={18} className="text-mitti-beige" />
                  </>
                ) : (
                  <>
                    Read More{" "}
                    <ChevronDown size={18} className="text-mitti-beige" />
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
          )}
          <CollapsibleContent>
            <div className="h-4" />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </section>
  );
};

export default DescriptionSection;
