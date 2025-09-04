"use client";

import { useSearchParams, useRouter } from "next/navigation";
import qs from "query-string";
import { useState, useCallback } from "react";
import { Button } from "../prebuilt-components/button";
import { Label } from "../prebuilt-components/label";
import { RadioGroup, RadioGroupItem } from "../prebuilt-components/radio-group";
import { Separator } from "@radix-ui/react-separator";
import { Slider } from "../prebuilt-components/slider";
import { Checkbox } from "../prebuilt-components/checkbox";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "../prebuilt-components/sheet";
import { Filter, X } from "lucide-react";
import { ScrollArea } from "../prebuilt-components/scroll-area";

const amenitiesList = [
  "WiFi",
  "Air Conditioning",
  "Breakfast Included",
  "Parking Available",
  "Pet Friendly",
  "Guide Available",
];

const ExploreSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [type, setType] = useState(searchParams.get("type") || "");
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("priceMin")) || 300,
    Number(searchParams.get("priceMax")) || 5000,
  ]);
  const [amenities, setAmenities] = useState(
    searchParams.getAll("amenities") || []
  );
  const [rating, setRating] = useState(searchParams.get("rating") || "");
  const [isApplying, setIsApplying] = useState(false);

  const handleAmenityToggle = (item: string) => {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleClearFilters = () => {
    setType("");
    setPriceRange([300, 1000]);
    setAmenities([]);
    setRating("");
  };

  const handleApplyFilters = useCallback(() => {
    if (isApplying) return;
    setIsApplying(true);

    const currentParams = qs.parse(searchParams.toString());
    const newQuery = {
      ...currentParams,
      type,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      rating,
      amenities,
    };

    const query = qs.stringifyUrl(
      {
        url: "/explore",
        query: newQuery,
      },
      { arrayFormat: "bracket" }
    );

    router.push(query);

    setTimeout(() => setIsApplying(false), 500);
  }, [type, priceRange, amenities, rating, router, searchParams, isApplying]);

  const SidebarContent = (
    <div className="w-full space-y-3 bg-gradient-to-b from-mitti-dark-brown to-mitti-brown text-mitti-cream p-6 rounded-2xl shadow-lg transition-all duration-300">
      <div>
        <Label className="text-base font-semibold mb-3 block text-mitti-cream">
          Type of Stay
        </Label>
        <RadioGroup
          value={type}
          onValueChange={setType}
          aria-label="Type of Stay"
        >
          <div className="flex items-center space-x-3 rounded-lg p-2 hover:bg-mitti-beige/20 transition-colors">
            <RadioGroupItem
              value="entire"
              id="entire"
              className="text-mitti-cream border-mitti-cream"
            />
            <Label
              htmlFor="entire"
              className="text-mitti-cream font-medium cursor-pointer"
            >
              Entire Home
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-lg p-2 hover:bg-mitti-beige/20 transition-colors">
            <RadioGroupItem
              value="private"
              id="private"
              className="text-mitti-cream border-mitti-cream"
            />
            <Label
              htmlFor="private"
              className="text-mitti-cream font-medium cursor-pointer"
            >
              Private Room
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Separator className="bg-mitti-cream/30 h-[1px]" />

      <div>
        <Label className="text-base font-semibold mb-3 block text-mitti-cream">
          Price Range
        </Label>
        <Slider
          defaultValue={priceRange}
          min={300}
          max={5000}
          step={10}
          onValueChange={setPriceRange}
          aria-label="Price Range Slider"
        />
        <div className="flex justify-between text-sm pt-2 text-mitti-khaki">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>

      <Separator className="bg-mitti-cream/30 h-[1px]" />

      <div>
        <Label className="text-base font-semibold mb-3 block text-mitti-cream">
          Amenities
        </Label>
        <div className="grid grid-cols-1 gap-1">
          {amenitiesList.map((item) => (
            <div
              key={item}
              className="flex items-center space-x-3 rounded-lg p-2 hover:bg-mitti-beige/20 transition-colors"
            >
              <Checkbox
                id={item}
                checked={amenities.includes(item)}
                onCheckedChange={() => handleAmenityToggle(item)}
                className="border-mitti-cream data-[state=checked]:bg-mitti-olive"
                aria-label={item}
              />
              <Label
                htmlFor={item}
                className="text-mitti-cream font-medium cursor-pointer"
              >
                {item}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-mitti-cream/30 h-[1px]" />

      <div>
        <Label className="text-base font-semibold mb-3 block text-mitti-cream">
          Rating
        </Label>
        <RadioGroup
          value={rating}
          onValueChange={setRating}
          aria-label="Rating"
        >
          <div className="flex items-center space-x-3 rounded-lg p-2 hover:bg-mitti-beige/20 transition-colors">
            <RadioGroupItem
              value="4"
              id="4"
              className="text-mitti-cream border-mitti-cream"
            />
            <Label
              htmlFor="4"
              className="text-mitti-cream font-medium cursor-pointer"
            >
              4★ & Above
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-lg p-2 hover:bg-mitti-beige/20 transition-colors">
            <RadioGroupItem
              value="3"
              id="3"
              className="text-mitti-cream border-mitti-cream"
            />
            <Label
              htmlFor="3"
              className="text-mitti-cream font-medium cursor-pointer"
            >
              3★ & Above
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex-col space-y-3">
        <Button
          variant="default"
          className="w-full bg-mitti-olive text-mitti-cream hover:bg-mitti-olive/90 transition-colors font-semibold rounded-lg py-2 cursor-pointer"
          onClick={handleApplyFilters}
          disabled={isApplying}
        >
          Apply Filters
        </Button>
        <Button
          variant="secondary"
          className="w-full bg-mitti-cream text-mitti-dark-brown hover:bg-mitti-khaki transition-colors font-semibold rounded-lg py-2 cursor-pointer"
          onClick={handleClearFilters}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );

  const MobileFilterContent = (
    <div className="w-full space-y-3 bg-gradient-to-b from-mitti-dark-brown to-mitti-brown text-mitti-cream p-6 rounded-2xl shadow-lg transition-all duration-300">
      <div>
        <Label className="text-base font-semibold mb-3 block text-mitti-cream">
          Type of Stay
        </Label>
        <RadioGroup
          value={type}
          onValueChange={setType}
          aria-label="Type of Stay"
        >
          <div className="flex items-center space-x-3 rounded-lg p-2 hover:bg-mitti-beige/20 transition-colors">
            <RadioGroupItem
              value="entire"
              id="entire"
              className="text-mitti-cream border-mitti-cream"
            />
            <Label
              htmlFor="entire"
              className="text-mitti-cream font-medium cursor-pointer"
            >
              Entire Home
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-lg p-2 hover:bg-mitti-beige/20 transition-colors">
            <RadioGroupItem
              value="private"
              id="private"
              className="text-mitti-cream border-mitti-cream"
            />
            <Label
              htmlFor="private"
              className="text-mitti-cream font-medium cursor-pointer"
            >
              Private Room
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Separator className="bg-mitti-cream/30 h-[1px]" />

      <div>
        <Label className="text-base font-semibold mb-3 block text-mitti-cream">
          Price Range
        </Label>
        <Slider
          defaultValue={priceRange}
          min={300}
          max={5000}
          step={10}
          onValueChange={setPriceRange}
          aria-label="Price Range Slider"
        />
        <div className="flex justify-between text-sm pt-2 text-mitti-khaki">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>

      <Separator className="bg-mitti-cream/30 h-[1px]" />

      <div>
        <Label className="text-base font-semibold mb-3 block text-mitti-cream">
          Amenities
        </Label>
        <div className="grid grid-cols-1 gap-1">
          {amenitiesList.map((item) => (
            <div
              key={item}
              className="flex items-center space-x-3 rounded-lg p-2 hover:bg-mitti-beige/20 transition-colors"
            >
              <Checkbox
                id={item}
                checked={amenities.includes(item)}
                onCheckedChange={() => handleAmenityToggle(item)}
                className="border-mitti-cream data-[state=checked]:bg-mitti-olive"
                aria-label={item}
              />
              <Label
                htmlFor={item}
                className="text-mitti-cream font-medium cursor-pointer"
              >
                {item}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-mitti-cream/30 h-[1px]" />

      <div>
        <Label className="text-base font-semibold mb-3 block text-mitti-cream">
          Rating
        </Label>
        <RadioGroup
          value={rating}
          onValueChange={setRating}
          aria-label="Rating"
        >
          <div className="flex items-center space-x-3 rounded-lg p-2 hover:bg-mitti-beige/20 transition-colors">
            <RadioGroupItem
              value="4"
              id="4"
              className="text-mitti-cream border-mitti-cream"
            />
            <Label
              htmlFor="4"
              className="text-mitti-cream font-medium cursor-pointer"
            >
              4★ & Above
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-lg p-2 hover:bg-mitti-beige/20 transition-colors">
            <RadioGroupItem
              value="3"
              id="3"
              className="text-mitti-cream border-mitti-cream"
            />
            <Label
              htmlFor="3"
              className="text-mitti-cream font-medium cursor-pointer"
            >
              3★ & Above
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );

  return (
    <div className="w-full md:w-70 font-sans">
      <div className="hidden md:block sticky top-6">{SidebarContent}</div>

      <div className="md:hidden w-full">
        <Sheet>
          <SheetTrigger asChild className="w-full">
            <Button
              variant="outline"
              className="w-full bg-mitti-beige text-mitti-dark-brown border-mitti-brown hover:bg-mitti-khaki transition-colors font-semibold rounded-lg py-2"
            >
              <Filter className="size-5 mr-2" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-4 w-80 bg-gradient-to-b from-mitti-dark-brown to-mitti-brown text-mitti-cream border-r-0 flex flex-col"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-mitti-cream">Filters</h2>
              <SheetClose asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-mitti-cream hover:bg-mitti-beige/20 rounded-full cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </Button>
              </SheetClose>
            </div>
            <ScrollArea className="flex-grow overflow-y-auto pr-4 scrollbar-hide">
              <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
                .scrollbar-hide {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
              `}</style>
              {MobileFilterContent}
            </ScrollArea>
            <div className="mt-4 space-y-3">
              <Button
                variant="default"
                className="w-full bg-mitti-olive text-mitti-cream hover:bg-mitti-olive/90 transition-colors font-semibold rounded-lg py-2 cursor-pointer"
                onClick={handleApplyFilters}
                disabled={isApplying}
              >
                Apply Filters
              </Button>
              <Button
                variant="secondary"
                className="w-full bg-mitti-cream text-mitti-dark-brown hover:bg-mitti-khaki transition-colors font-semibold rounded-lg py-2 cursor-pointer"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default ExploreSidebar;
