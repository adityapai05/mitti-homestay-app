"use client";

import { useSearchParams, useRouter } from "next/navigation";
import qs from "query-string";
import { useEffect, useState } from "react";
import { Button } from "../prebuilt-components/button";
import { Label } from "../prebuilt-components/label";
import { RadioGroup, RadioGroupItem } from "../prebuilt-components/radio-group";
import { Separator } from "@radix-ui/react-separator";
import { Slider } from "../prebuilt-components/slider";
import { Checkbox } from "../prebuilt-components/checkbox";
import {
  Sheet,
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
  //TODO: render list dynamically based on the amenities of the all filtered homestays
];

const ExploreSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [type, setType] = useState(searchParams.get("type") || "");
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("priceMin")) || 300,
    Number(searchParams.get("priceMax")) || 1000,
  ]);
  const [amenities, setAmenities] = useState(
    searchParams.getAll("amenity") || []
  );
  const [rating, setRating] = useState(searchParams.get("rating") || "");

  useEffect(() => {
    const query = qs.stringifyUrl(
      {
        url: "/explore",
        query: {
          type,
          priceMin: priceRange[0],
          priceMax: priceRange[1],
          rating,
          amenity: amenities,
        },
      },
      { arrayFormat: "bracket" }
    );
    router.push(query);
  }, [type, priceRange, amenities, rating]);

  const handleClearFilters = () => {
    setType("");
    setPriceRange([300, 1000]);
    setAmenities([]);
    setRating("");
  };

  const handleAmenityToggle = (item: string) => {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const SidebarContent = (
    <div className="w-full space-y-6 bg-mitti-dark-brown text-white p-4 rounded-xl shadow-md">
      <div>
        <Label className="text-sm mb-2 block text-white">Type of Stay</Label>
        <RadioGroup value={type} onValueChange={setType} className="space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="entire" id="entire" />
            <Label htmlFor="entire" className="text-white">
              Entire Home
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="private" id="private" />
            <Label htmlFor="private" className="text-white">
              Private Room
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Separator className="bg-white/20" />

      <div>
        <Label className="text-sm mb-2 block text-white">Price Range</Label>
        <Slider
          defaultValue={priceRange}
          min={300}
          max={1000}
          step={10}
          onValueChange={setPriceRange}
          className=""
        />
        <div className="flex justify-between text-sm pt-1">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>

      <Separator className="bg-white/20" />

      <div>
        <Label className="text-sm mb-2 block text-white">Amenities</Label>
        <div className="grid grid-cols-1 gap-2">
          {amenitiesList.map((item) => (
            <div className="flex items-center space-x-2" key={item}>
              <Checkbox
                id={item}
                checked={amenities.includes(item)}
                onCheckedChange={() => handleAmenityToggle(item)}
              />
              <Label htmlFor={item} className="text-white">
                {item}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-white/20" />

      <div>
        <Label className="text-sm mb-2 block text-white">Rating</Label>
        <RadioGroup
          value={rating}
          onValueChange={setRating}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="4" id="4" />
            <Label htmlFor="4" className="text-white">
              4★ & Above
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3" id="3" />
            <Label htmlFor="3" className="text-white">
              3★ & Above
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Button
        variant="secondary"
        className="w-full bg-white text-mitti-dark-brown hover:bg-white/90"
        onClick={handleClearFilters}
      >
        Clear Filters
      </Button>
    </div>
  );

  return (
    <div className="md:w-64 w-full">
      <div className="hidden md:block sticky top-4">{SidebarContent}</div>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="mb-4">
              <Filter className="w-4 h-4 mr-2" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-4 overflow-y-auto w-80 bg-mitti-dark-brown text-white"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Filters</h2>
              <Button size="icon" variant="ghost">
                <X className="w-5 h-5 text-white" />
              </Button>
            </div>
            <ScrollArea className="h-[80vh] pr-2">{SidebarContent}</ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default ExploreSidebar;
