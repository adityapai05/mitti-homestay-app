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
  address: string;
  latitude: number;
  longitude: number;
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