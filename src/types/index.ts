interface SearchBarProps {
  mode?: "search" | "edit"; 
}

interface Homestay {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  pricePerNight: string | number;
  rating: number;
}

