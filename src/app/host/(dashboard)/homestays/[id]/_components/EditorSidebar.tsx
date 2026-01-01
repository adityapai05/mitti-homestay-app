"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/prebuilt-components/sidebar";

import {
  ImageIcon,
  Type,
  AlignLeft,
  IndianRupee,
  BedDouble,
  ListChecks,
  MapPin,
  Settings,
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

type EditorSidebarProps = {
  activeSection: EditorSection;
  draft: HomestayEditorData;
  onSectionChange: (section: EditorSection) => void;
};

const yourSpaceItems = [
  { key: "photos", label: "Photos", icon: ImageIcon },
  { key: "title", label: "Title", icon: Type },
  { key: "description", label: "Description", icon: AlignLeft },
  { key: "pricing", label: "Pricing", icon: IndianRupee },
  { key: "basics", label: "Basics", icon: BedDouble },
  { key: "amenities", label: "Amenities", icon: ListChecks },
  { key: "location", label: "Location", icon: MapPin },
  { key: "settings", label: "Listing settings", icon: Settings },
] as const;

const getPreview = (section: EditorSection, draft: HomestayEditorData) => {
  switch (section) {
    case "photos":
      return draft.imageUrl.length
        ? `${draft.imageUrl.length} photos`
        : "Add photos";
    case "title":
      return draft.name || "Add title";
    case "description":
      return draft.description
        ? draft.description.slice(0, 32) + "…"
        : "Add description";
    case "pricing":
      return draft.pricePerNight
        ? `₹${draft.pricePerNight} / night`
        : "Set price";
    case "basics":
      return `${draft.maxGuests} guests · ${draft.beds} beds`;
    case "amenities":
      return draft.amenities.length
        ? `${draft.amenities.length} amenities`
        : "Add amenities";
    case "location":
      return draft.village
        ? `${draft.village}, ${draft.state}`
        : "Set location";
    case "settings":
      return "Verification, guide, delete";
    default:
      return "";
  }
};

const EditorSidebar = ({
  activeSection,
  draft,
  onSectionChange,
}: EditorSidebarProps) => {
  const { setOpenMobile, isMobile } = useSidebar();

  return (
    <Sidebar
      variant="sidebar"
      collapsible="offcanvas"
      className="border-r border-mitti-khaki bg-mitti-cream pt-16"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-semibold">
            Your space
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {yourSpaceItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.key;

                return (
                  <SidebarMenuItem key={item.key} className="my-1">
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => {
                        onSectionChange(item.key);
                        if (isMobile) setOpenMobile(false);
                      }}
                      className={`
                        cursor-pointer
                        transition-all duration-150
                        rounded-xl
                        px-3 py-2
                        hover:bg-mitti-beige
                        hover:translate-x-[2px]
                        ${
                          isActive
                            ? "bg-mitti-beige text-mitti-brown"
                            : "text-mitti-dark-brown"
                        }
                      `}
                    >
                      <Icon size={18} />

                      <div className="flex flex-col min-w-0 text-left">
                        <span className="text-sm">{item.label}</span>
                        <span className="text-xs text-muted-foreground truncate">
                          {getPreview(item.key, draft)}
                        </span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default EditorSidebar;
