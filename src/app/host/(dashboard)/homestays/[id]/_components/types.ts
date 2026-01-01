export type HomestayEditorData = {
  id: string;

  name: string;
  description: string;
  imageUrl: string[];

  category: string;
  type: "ROOM" | "HOME";

  pricePerNight: number | null;

  maxGuests: number;
  beds: number;
  bedrooms: number;
  bathrooms: number;

  amenities: string[];
  flatno: string;
  street: string;
  landmark?: string;
  village: string;
  district?: string;
  state: string;
  pincode: string;

  latitude: number;
  longitude: number;

  guideAvailable: boolean;
  guideFee: number | null;

  checkInTime: string | null;
  checkOutTime: string | null;

  isVerified: boolean;
};
