"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  SlidersHorizontal,
  Minus,
  Plus,
  Wifi,
  Car,
  Zap,
  Droplets,
  Fan,
  Utensils,
  CookingPot,
  Trees,
  Sprout,
  Map,
  ShieldPlus,
  FireExtinguisher,
  BellRing,
  Camera,
  Star,
  X,
} from "lucide-react";
import { useExploreNavigation } from "@/hooks/useExploreNavigation";
import {
  serializeExploreQuery,
  useExploreQuery,
  type ExploreQueryParams,
} from "@/hooks/useExploreQuery";

type CounterValue = number | null;

type FiltersState = {
  categories: string[];
  type?: "ROOM" | "HOME";
  minPrice: number;
  maxPrice: number;
  minGuests: CounterValue;
  minBedrooms: CounterValue;
  minBathrooms: CounterValue;
  essentials: string[];
  experiences: string[];
  safety: string[];
  rating?: number;
};

const PRICE_MIN = 300;
const PRICE_MAX = 5000;

const DEFAULT_FILTERS: FiltersState = {
  categories: [],
  type: undefined,
  minPrice: PRICE_MIN,
  maxPrice: PRICE_MAX,
  minGuests: null,
  minBedrooms: null,
  minBathrooms: null,
  essentials: [],
  experiences: [],
  safety: [],
  rating: undefined,
};

const CATEGORY_CARDS = [
  { key: "FARM_STAY", title: "Farm stay", image: "/categories/farm.png" },
  { key: "ECO_LODGE", title: "Eco lodge", image: "/categories/forest.png" },
  {
    key: "TRADITIONAL_HOME",
    title: "Traditional home",
    image: "/categories/traditional.png",
  },
  {
    key: "MOUNTAIN_RETREAT",
    title: "Mountain retreat",
    image: "/categories/mountains.png",
  },
  { key: "LAKESIDE", title: "Lakeside", image: "/categories/river.png" },
  { key: "OTHER", title: "Other", image: "/categories/other.png" },
];

const ESSENTIALS = [
  { key: "drinking_water", label: "Drinking water", icon: Droplets },
  { key: "electricity", label: "Electricity", icon: Zap },
  { key: "power_backup", label: "Power backup", icon: Zap },
  { key: "fan", label: "Fan", icon: Fan },
  { key: "parking", label: "Parking", icon: Car },
  { key: "wifi", label: "WiFi", icon: Wifi },
];

const EXPERIENCES = [
  { key: "home_food", label: "Home cooked meals", icon: Utensils },
  { key: "kitchen", label: "Kitchen access", icon: CookingPot },
  { key: "farm_access", label: "Farm access", icon: Sprout },
  { key: "garden", label: "Garden or courtyard", icon: Trees },
  { key: "local_guide", label: "Local guide", icon: Map },
];

const SAFETY = [
  { key: "first_aid", label: "First aid kit", icon: ShieldPlus },
  {
    key: "fire_extinguisher",
    label: "Fire extinguisher",
    icon: FireExtinguisher,
  },
  { key: "smoke_alarm", label: "Smoke alarm", icon: BellRing },
  { key: "cctv", label: "CCTV (common areas)", icon: Camera },
];

const ESSENTIAL_KEYS = new Set(ESSENTIALS.map((e) => e.key));
const EXPERIENCE_KEYS = new Set(EXPERIENCES.map((e) => e.key));
const SAFETY_KEYS = new Set(SAFETY.map((s) => s.key));

function Counter({
  label,
  value,
  onChange,
}: {
  label: string;
  value: CounterValue;
  onChange: (v: CounterValue) => void;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-mitti-khaki/30 last:border-0">
      <span className="text-base font-medium text-mitti-dark-brown">
        {label}
      </span>
      <div className="flex items-center gap-4">
        <button
          disabled={value === null}
          onClick={() => onChange(value && value > 1 ? value - 1 : null)}
          className="w-8 h-8 rounded-full border-2 border-mitti-khaki flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-mitti-brown hover:bg-mitti-cream/50 transition-all active:scale-95"
        >
          <Minus size={16} className="text-mitti-dark-brown" />
        </button>
        <span className="w-10 text-center text-base font-medium text-mitti-dark-brown">
          {value ?? "Any"}
        </span>
        <button
          onClick={() => onChange((value ?? 0) + 1)}
          className="w-8 h-8 rounded-full border-2 border-mitti-khaki flex items-center justify-center hover:border-mitti-brown hover:bg-mitti-cream/50 transition-all active:scale-95"
        >
          <Plus size={16} className="text-mitti-dark-brown" />
        </button>
      </div>
    </div>
  );
}

export default function ExploreFilters() {
  const { updateQuery } = useExploreNavigation();
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const query = useExploreQuery();
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (hasHydrated.current) return;
    hasHydrated.current = true;

    const amenities = query.amenities ?? [];

    const urlFilters: FiltersState = {
      categories: query.category ?? [],
      type: query.type,

      minPrice: query.minPrice ?? PRICE_MIN,
      maxPrice: query.maxPrice ?? PRICE_MAX,

      minGuests: query.minGuests ?? null,
      minBedrooms: query.minBedrooms ?? null,
      minBathrooms: query.minBathrooms ?? null,

      essentials: amenities.filter((a) => ESSENTIAL_KEYS.has(a)),
      experiences: amenities.filter((a) => EXPERIENCE_KEYS.has(a)),
      safety: amenities.filter((a) => SAFETY_KEYS.has(a)),

      rating: query.rating,
    };

    setFilters(urlFilters);
  }, [query]);

  function toggleArray(
    key: string,
    arr: string[],
    setter: (v: string[]) => void,
  ) {
    setter(arr.includes(key) ? arr.filter((x) => x !== key) : [...arr, key]);
  }

  const queryString = useMemo(() => {
    const allAmenities = Array.from(
      new Set([
        ...filters.essentials,
        ...filters.experiences,
        ...filters.safety,
      ]),
    );

    const params: ExploreQueryParams = {
      category: filters.categories.length > 0 ? filters.categories : undefined,
      type: filters.type,
      minPrice: filters.minPrice !== PRICE_MIN ? filters.minPrice : undefined,
      maxPrice: filters.maxPrice !== PRICE_MAX ? filters.maxPrice : undefined,
      minGuests: filters.minGuests ?? undefined,
      minBedrooms: filters.minBedrooms ?? undefined,
      minBathrooms: filters.minBathrooms ?? undefined,
      amenities: allAmenities.length > 0 ? allAmenities : undefined,
      rating: filters.rating ?? undefined,
      sort: query.sort,
      page: 1,
    };

    return serializeExploreQuery(params);
  }, [filters, query.sort]);

  useEffect(() => {
    if (!open) return;
    setIsLoading(true);
    const url = queryString ? `/api/homestays?${queryString}` : "/api/homestays";
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        console.log(d);
        setCount(d.homestays.length ?? 0);
        setIsLoading(false);
      })
      .catch(() => {
        setCount(0);
        setIsLoading(false);
      });
  }, [queryString, open]);

  function applyFilters() {
    const allAmenities = Array.from(
      new Set([
        ...filters.essentials,
        ...filters.experiences,
        ...filters.safety,
      ]),
    );

    const queryParams: ExploreQueryParams = {
      category: filters.categories.length > 0 ? filters.categories : undefined,
      type: filters.type,
      minPrice: filters.minPrice !== PRICE_MIN ? filters.minPrice : undefined,
      maxPrice: filters.maxPrice !== PRICE_MAX ? filters.maxPrice : undefined,
      minGuests: filters.minGuests ?? undefined,
      minBedrooms: filters.minBedrooms ?? undefined,
      minBathrooms: filters.minBathrooms ?? undefined,
      amenities: allAmenities.length > 0 ? allAmenities : undefined,
      rating: filters.rating ?? undefined,
      page: 1,
    };

    // Apply the filters via navigation
    updateQuery(queryParams);
    setOpen(false);
  }

  const hasActiveFilters =
    filters.type !== undefined ||
    filters.categories.length > 0 ||
    filters.minPrice !== PRICE_MIN ||
    filters.maxPrice !== PRICE_MAX ||
    filters.minGuests !== null ||
    filters.minBedrooms !== null ||
    filters.minBathrooms !== null ||
    filters.essentials.length > 0 ||
    filters.experiences.length > 0 ||
    filters.safety.length > 0 ||
    filters.rating !== undefined;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 border border-mitti-khaki rounded-full hover:border-mitti-brown hover:shadow-md transition-all shadow-sm relative bg-white active:scale-95"
      >
        <SlidersHorizontal size={16} className="text-mitti-dark-brown" />
        <span className="font-medium text-sm text-mitti-dark-brown">
          Filters
        </span>
        {hasActiveFilters && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-mitti-brown rounded-full animate-pulse" />
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
              open ? "opacity-100" : "opacity-0"
            }`}
            style={{ animation: "fadeIn 0.3s ease-out" }}
          />

          {/* Modal - Desktop centered, Mobile bottom sheet */}
          <div
            className={`fixed z-50 bg-mitti-beige shadow-2xl flex flex-col overflow-hidden
              ${
                isMobile
                  ? "bottom-0 left-0 right-0 rounded-t-3xl max-h-[92vh]"
                  : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(95vw,780px)] max-h-[90vh] rounded-2xl"
              }
            `}
            style={{
              animation: isMobile
                ? "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
                : "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-mitti-khaki/50 shrink-0 bg-mitti-beige">
              <button
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-full hover:bg-mitti-cream flex items-center justify-center transition-all active:scale-90"
                aria-label="Close filters"
              >
                <X size={18} className="text-mitti-dark-brown" />
              </button>
              <h2 className="text-lg font-semibold text-mitti-dark-brown">
                Filters
              </h2>
              <div className="w-9" />
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10">
              {/* Type of stay */}
              <section>
                <h3 className="font-semibold mb-4 text-mitti-dark-brown">
                  Type of stay
                </h3>
                <div className="relative flex rounded-full bg-white p-1 border border-mitti-khaki">
                  <div
                    className={`absolute inset-y-1 w-1/3 rounded-full bg-mitti-dark-brown transition-transform duration-300 ease-out ${
                      filters.type === "ROOM"
                        ? "translate-x-full"
                        : filters.type === "HOME"
                          ? "translate-x-[200%]"
                          : ""
                    }`}
                  />
                  {["Any", "ROOM", "HOME"].map((v) => (
                    <button
                      key={v}
                      className={`relative z-10 flex-1 py-2 text-sm font-medium transition-colors duration-300 ${
                        (v === "Any" && !filters.type) || filters.type === v
                          ? "text-mitti-cream"
                          : "text-mitti-dark-brown"
                      }`}
                      onClick={() =>
                        setFilters((p) => ({
                          ...p,
                          type:
                            v === "Any" ? undefined : (v as "ROOM" | "HOME"),
                        }))
                      }
                    >
                      {v === "Any"
                        ? "Any"
                        : v === "ROOM"
                          ? "Room"
                          : "Entire home"}
                    </button>
                  ))}
                </div>
              </section>

              {/* Categories */}
              <section>
                <h3 className="font-semibold mb-4 text-mitti-dark-brown">
                  Stay setting
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {CATEGORY_CARDS.map((c) => {
                    const isActive = filters.categories.includes(c.key);
                    return (
                      <button
                        key={c.key}
                        onClick={() =>
                          toggleArray(c.key, filters.categories, (v) =>
                            setFilters((p) => ({ ...p, categories: v })),
                          )
                        }
                        className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 ${
                          isActive
                            ? "border-mitti-brown ring-2 ring-mitti-brown shadow-lg"
                            : "border-mitti-khaki hover:border-mitti-brown/50"
                        }`}
                      >
                        <Image
                          src={c.image}
                          alt={c.title}
                          width={400}
                          height={260}
                          className="h-32 w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div
                          className={`absolute inset-0 transition-colors duration-300 ${
                            isActive ? "bg-black/20" : "bg-black/30"
                          }`}
                        />
                        <span className="absolute bottom-3 left-3 text-white font-semibold text-sm drop-shadow-lg">
                          {c.title}
                        </span>
                        {isActive && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-mitti-brown rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Price Range */}
              <section>
                <h3 className="font-semibold mb-4 text-mitti-dark-brown">
                  Price range
                </h3>
                <div className="space-y-6">
                  {/* Price Distribution Chart */}
                  <div className="h-16 flex items-end gap-[2px] px-2">
                    {Array.from({ length: 40 }).map((_, i) => {
                      const height = 20 + Math.random() * 60;
                      const inRange =
                        i >=
                          ((filters.minPrice - PRICE_MIN) /
                            (PRICE_MAX - PRICE_MIN)) *
                            40 &&
                        i <=
                          ((filters.maxPrice - PRICE_MIN) /
                            (PRICE_MAX - PRICE_MIN)) *
                            40;
                      return (
                        <div
                          key={i}
                          className={`flex-1 rounded-sm transition-all duration-300 origin-bottom ${
                            inRange ? "bg-mitti-brown" : "bg-mitti-khaki/40"
                          }`}
                          style={{
                            height: `${height}%`,
                            transitionDelay: `${i * 10}ms`,
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Range Slider */}
                  <div className="relative h-2 bg-mitti-khaki/30 rounded-full">
                    <div
                      className="absolute h-full bg-mitti-brown rounded-full transition-all duration-300"
                      style={{
                        left: `${((filters.minPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
                        right: `${100 - ((filters.maxPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
                      }}
                    />
                    <input
                      type="range"
                      min={PRICE_MIN}
                      max={PRICE_MAX}
                      step={50}
                      value={filters.minPrice}
                      onChange={(e) =>
                        setFilters((p) => ({
                          ...p,
                          minPrice: Math.min(
                            Number(e.target.value),
                            p.maxPrice - 50,
                          ),
                        }))
                      }
                      className={`absolute w-full -top-1 appearance-none bg-transparent pointer-events-auto cursor-pointer
[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-mitti-brown
[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md
hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform
[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full
[&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-mitti-brown
[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md`}
                    />

                    <input
                      type="range"
                      min={PRICE_MIN}
                      max={PRICE_MAX}
                      step={50}
                      value={filters.maxPrice}
                      onChange={(e) =>
                        setFilters((p) => ({
                          ...p,
                          maxPrice: Math.max(
                            Number(e.target.value),
                            p.minPrice + 50,
                          ),
                        }))
                      }
                      className={`absolute w-full -top-1 appearance-none bg-transparent pointer-events-auto cursor-pointer
[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-mitti-brown
[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md
hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform
[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full
[&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-mitti-brown
[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md`}
                    />
                  </div>

                  {/* Price Inputs */}
                  <div className="flex gap-4 pt-2">
                    <div className="flex-1">
                      <label className="text-xs text-mitti-dark-brown/70 mb-2 block font-medium">
                        Minimum
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-mitti-dark-brown/60 font-medium">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={filters.minPrice}
                          onChange={(e) =>
                            setFilters((p) => ({
                              ...p,
                              minPrice: Number(e.target.value),
                            }))
                          }
                          className="w-full rounded-xl border border-mitti-khaki bg-white px-4 pl-7 py-3 text-mitti-dark-brown focus:outline-none focus:ring-2 focus:ring-mitti-brown focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-mitti-dark-brown/70 mb-2 block font-medium">
                        Maximum
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-mitti-dark-brown/60 font-medium">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={filters.maxPrice}
                          onChange={(e) =>
                            setFilters((p) => ({
                              ...p,
                              maxPrice: Number(e.target.value),
                            }))
                          }
                          className="w-full rounded-xl border border-mitti-khaki bg-white px-4 pl-7 py-3 text-mitti-dark-brown focus:outline-none focus:ring-2 focus:ring-mitti-brown focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Rooms and Capacity */}
              <section>
                <h3 className="font-semibold mb-4 text-mitti-dark-brown">
                  Rooms and capacity
                </h3>
                <div className="bg-white rounded-xl border border-mitti-khaki p-4">
                  <Counter
                    label="Guests"
                    value={filters.minGuests}
                    onChange={(v) =>
                      setFilters((p) => ({ ...p, minGuests: v }))
                    }
                  />
                  <Counter
                    label="Bedrooms"
                    value={filters.minBedrooms}
                    onChange={(v) =>
                      setFilters((p) => ({ ...p, minBedrooms: v }))
                    }
                  />
                  <Counter
                    label="Bathrooms"
                    value={filters.minBathrooms}
                    onChange={(v) =>
                      setFilters((p) => ({ ...p, minBathrooms: v }))
                    }
                  />
                </div>
              </section>

              {/* Amenities Sections */}
              {[
                { title: "Essentials", items: ESSENTIALS, key: "essentials" },
                {
                  title: "Food and local experience",
                  items: EXPERIENCES,
                  key: "experiences",
                },
                { title: "Safety and hygiene", items: SAFETY, key: "safety" },
              ].map((section) => (
                <section key={section.key}>
                  <h3 className="font-semibold mb-4 text-mitti-dark-brown">
                    {section.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const sectionValue =
                        filters[section.key as keyof FiltersState];
                      const isActive = Array.isArray(sectionValue)
                        ? sectionValue.includes(item.key)
                        : false;
                      return (
                        <button
                          key={item.key}
                          onClick={() =>
                            toggleArray(
                              item.key,
                              filters[
                                section.key as keyof FiltersState
                              ] as string[],
                              (v) =>
                                setFilters((p) => ({
                                  ...p,
                                  [section.key]: v,
                                })),
                            )
                          }
                          className={`flex items-center gap-3 rounded-xl border-2 p-3.5 text-sm font-medium transition-all hover:scale-[1.02] active:scale-95 ${
                            isActive
                              ? "border-mitti-brown bg-mitti-cream shadow-md"
                              : "border-mitti-khaki bg-white hover:border-mitti-brown/50"
                          }`}
                        >
                          <Icon
                            size={18}
                            className={
                              isActive
                                ? "text-mitti-brown"
                                : "text-mitti-dark-brown"
                            }
                          />
                          <span className="text-mitti-dark-brown">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}

              {/* Guest Rating */}
              <section>
                <h3 className="font-semibold mb-4 text-mitti-dark-brown">
                  Guest rating
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[3, 4, 4.5].map((r) => {
                    const isActive = filters.rating === r;
                    return (
                      <button
                        key={r}
                        onClick={() =>
                          setFilters((p) => ({
                            ...p,
                            rating: p.rating === r ? undefined : r,
                          }))
                        }
                        className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3.5 font-medium transition-all hover:scale-[1.02] active:scale-95 ${
                          isActive
                            ? "border-mitti-brown bg-mitti-cream shadow-md"
                            : "border-mitti-khaki bg-white hover:border-mitti-brown/50"
                        }`}
                      >
                        <Star
                          size={16}
                          className={
                            isActive
                              ? "fill-mitti-brown text-mitti-brown"
                              : "text-mitti-dark-brown"
                          }
                        />
                        <span className="text-mitti-dark-brown">{r}+</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-mitti-khaki/50 shrink-0 bg-mitti-beige">
              <button
                onClick={() => setFilters({ ...DEFAULT_FILTERS })}
                className="text-sm font-semibold underline text-mitti-dark-brown hover:text-mitti-brown transition-colors active:scale-95"
              >
                Clear all
              </button>
              <button
                onClick={applyFilters}
                disabled={isLoading}
                className="bg-mitti-dark-brown text-mitti-cream px-6 py-3 rounded-full font-semibold flex items-center gap-2 min-w-[140px] justify-center hover:bg-mitti-brown transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-mitti-cream border-t-transparent rounded-full animate-spin" />
                ) : (
                  `Show ${count} stays`
                )}
              </button>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </>
  );
}
