export enum HomestayType {
  ROOM = 'ROOM',
  HOME = 'HOME',
}

export enum HomestayCategory {
  FARM_STAY = 'FARM_STAY',
  ECO_LODGE = 'ECO_LODGE',
  TRADITIONAL_HOME = 'TRADITIONAL_HOME',
  MOUNTAIN_RETREAT = 'MOUNTAIN_RETREAT',
  LAKESIDE = 'LAKESIDE',
  OTHER = 'OTHER',
}
export interface Homestay {
  id: string;
  ownerId: string;

  name: string;
  description: string;
  
  flatno?: string | null;
  street?: string | null;
  landmark?: string | null;
  village?: string | null;
  district?: string | null;
  state?: string | null;
  pincode?: string | null;

  latitude?: number | null;
  longitude?: number | null;

  pricePerNight: string;

  beds: number;
  type: HomestayType;
  maxGuests: number;

  imageUrl: string[];
  amenities: string[];

  rating: number;
  reviewCount: number;

  guideAvailable: boolean;
  guideFee: string | null;

  checkInTime: string;
  checkOutTime: string;

  category: HomestayCategory;
  isVerified: boolean;

  createdAt: string;
  updatedAt: string;

  owner: {
    id: string;
    name: string;
    email: string;
    phone: string;
    image: string | null;
  };
}
