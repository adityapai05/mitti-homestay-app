"use client";

import Image from "next/image";
import {
  ImageIcon,
  Type,
  AlignLeft,
  IndianRupee,
  BedDouble,
  ListChecks,
  MapPin,
  Settings,
  X,
} from "lucide-react";
import { HomestayEditorData } from "./types";

type EditorSection =
  | "photos"
  | "title"
  | "description"
  | "pricing"
  | "basics"
  | "amenities"
  | "location"
  | "settings";

type Props = {
  open: boolean;
  activeSection: EditorSection;
  draft: HomestayEditorData;
  onSectionChange: (section: EditorSection) => void;
  onClose: () => void;
};

const navItems: {
  key: EditorSection;
  label: string;
  icon: React.ElementType;
  preview: (d: HomestayEditorData) => string;
}[] = [
  {
    key: "photos",
    label: "Photos",
    icon: ImageIcon,
    preview: (d) =>
      d.imageUrl.length ? `${d.imageUrl.length} photos` : "Add photos",
  },
  {
    key: "title",
    label: "Title",
    icon: Type,
    preview: (d) => d.name || "Add title",
  },
  {
    key: "description",
    label: "Description",
    icon: AlignLeft,
    preview: (d) =>
      d.description ? d.description.slice(0, 28) + "…" : "Add description",
  },
  {
    key: "pricing",
    label: "Pricing",
    icon: IndianRupee,
    preview: (d) =>
      d.pricePerNight ? `₹${d.pricePerNight} / night` : "Set price",
  },
  {
    key: "basics",
    label: "Basics",
    icon: BedDouble,
    preview: (d) => `${d.maxGuests} guests · ${d.beds} beds`,
  },
  {
    key: "amenities",
    label: "Amenities",
    icon: ListChecks,
    preview: (d) =>
      d.amenities.length ? `${d.amenities.length} amenities` : "Add amenities",
  },
  {
    key: "location",
    label: "Location",
    icon: MapPin,
    preview: (d) => (d.village ? `${d.village}, ${d.state}` : "Set location"),
  },
  {
    key: "settings",
    label: "Listing settings",
    icon: Settings,
    preview: () => "Verification, policy, delete",
  },
];

const EditorSidebar = ({
  open,
  activeSection,
  draft,
  onSectionChange,
  onClose,
}: Props) => {
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 w-64
        bg-mitti-cream border-r border-mitti-khaki
        transform transition-transform duration-200
        lg:static lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="flex h-full flex-col px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/mitti-logo-icon.png"
              alt="MITTI"
              width={32}
              height={32}
            />
            <div>
              <p className="text-sm font-semibold text-mitti-dark-brown">
                Edit listing
              </p>
              <p className="text-xs text-mitti-dark-brown/60">
                Listing configuration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden rounded-md p-2 hover:bg-mitti-beige"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onSectionChange(item.key)}
                className={`
                  w-full rounded-md px-3 py-2 text-left transition
                  ${
                    isActive
                      ? "bg-mitti-beige text-mitti-dark-brown font-medium"
                      : "text-mitti-dark-brown/80 hover:bg-mitti-beige"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span className="text-sm">{item.label}</span>
                </div>

                <div className="ml-7 text-xs text-mitti-dark-brown/60 truncate">
                  {item.preview(draft)}
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default EditorSidebar;
