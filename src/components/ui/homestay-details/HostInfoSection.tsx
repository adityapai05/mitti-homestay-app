"use client";

import Image from "next/image";
import { MessageCircle, Copy, Check } from "lucide-react";
import { Homestay } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/prebuilt-components/dialog";
import { Button } from "@/components/ui/prebuilt-components/button";
import { useState, useEffect } from "react";

interface HostInfoSectionProps {
  homestay: Homestay;
}

const HostInfoSection: React.FC<HostInfoSectionProps> = ({ homestay }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<"email" | "phone" | null>(
    null
  );

  useEffect(() => {
    if (copiedField) {
      const timer = setTimeout(() => setCopiedField(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedField]);

  const handleCopy = async (text: string, field: "email" | "phone") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section className="py-10 px-6 bg-mitti-cream shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          {/* Left: Host Info */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              {homestay.owner.image ? (
                <Image
                  src={homestay.owner.image}
                  alt={`Host ${homestay.owner.name}`}
                  fill
                  className="rounded-full object-cover border-2 border-mitti-khaki shadow-sm"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-mitti-brown/20 flex items-center justify-center text-mitti-dark-brown font-medium text-lg">
                  {getInitials(homestay.owner.name)}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-mitti-dark-brown">
                Hosted by {homestay.owner.name}
              </h2>
            </div>
          </div>

          {/* Right: Contact Host */}
          <Button
            className="flex items-center gap-2 px-5 py-2.5 bg-mitti-brown text-white rounded-full hover:bg-mitti-brown/90 transition-all duration-200 hover:shadow-md cursor-pointer"
            aria-label="Contact host"
            onClick={() => setIsDialogOpen(true)}
          >
            <MessageCircle size={18} />
            Contact Host
          </Button>
        </div>

        {/* Dialog for Contact Info */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-mitti-cream text-mitti-dark-brown max-w-md sm:max-w-lg p-6 rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-mitti-dark-brown">
                Contact {homestay.owner.name}
              </DialogTitle>
              <DialogDescription className="text-mitti-dark-brown/80">
                Reach out to the host for more information or inquiries.
              </DialogDescription>
            </DialogHeader>
            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <p className="font-medium w-20">Email:</p>
                <div className="flex items-center gap-2 flex-1">
                  {homestay.owner.email ? (
                    <>
                      <a
                        href={`mailto:${homestay.owner.email}`}
                        className="text-mitti-dark-brown hover:underline truncate"
                        aria-label={`Email ${homestay.owner.name}`}
                      >
                        {homestay.owner.email}
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleCopy(homestay.owner.email!, "email")
                        }
                        aria-label="Copy email"
                        className="text-mitti-dark-brown hover:bg-mitti-khaki/20  cursor-pointer"
                      >
                        {copiedField === "email" ? (
                          <Check size={16} className="text-mitti-olive" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </Button>
                    </>
                  ) : (
                    <span className="text-mitti-dark-brown/60">
                      Email not provided
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-medium w-20">Phone:</p>
                <div className="flex items-center gap-2 flex-1">
                  {homestay.owner.phone ? (
                    <>
                      <a
                        href={`tel:${homestay.owner.phone}`}
                        className="text-mitti-dark-brown hover:underline"
                        aria-label={`Call ${homestay.owner.name}`}
                      >
                        {homestay.owner.phone}
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleCopy(homestay.owner.phone!, "phone")
                        }
                        aria-label="Copy phone number"
                        className="text-mitti-dark-brown hover:bg-mitti-khaki/20"
                      >
                        {copiedField === "phone" ? (
                          <Check size={16} className="text-mitti-olive" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </Button>
                    </>
                  ) : (
                    <span className="text-mitti-dark-brown/60">
                      Phone not provided
                    </span>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                className="border-mitti-khaki bg-mitti-brown text-mitti-beige hover:bg-mitti-dark-brown hover:text-mitti-beige cursor-pointer"
                onClick={() => setIsDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default HostInfoSection;
