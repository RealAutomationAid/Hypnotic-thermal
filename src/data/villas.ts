
import { VillaProps } from '@/components/VillaCard';

export const initialVillasData: Omit<VillaProps, "amenities">[] & { amenityIds: string[] }[] = [
  {
    id: 1,
    name: "Serenity Villa",
    description: "Our most secluded villa with private thermal pool and panoramic mountain views, perfect for couples.",
    price: 299,
    capacity: 2,
    size: 85,
    isAvailable: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80",
        alt: "Serenity Villa Exterior"
      },
      {
        url: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&q=80",
        alt: "Serenity Villa Bedroom"
      },
      {
        url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80",
        alt: "Serenity Villa Pool"
      }
    ],
    amenityIds: ["wifi", "kingBed", "capacity2"]
  },
  {
    id: 2,
    name: "Harmony Villa",
    description: "Modern villa with a blend of contemporary design and natural elements, featuring a private steam room.",
    price: 349,
    capacity: 4,
    size: 120,
    isAvailable: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80",
        alt: "Harmony Villa Exterior"
      },
      {
        url: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&q=80",
        alt: "Harmony Villa Living Room"
      },
      {
        url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80",
        alt: "Harmony Villa Thermal Pool"
      }
    ],
    amenityIds: ["wifi", "petFriendly", "queenBed", "capacity4"]
  },
  {
    id: 3,
    name: "Tranquility Villa",
    description: "Spacious family villa with two bedrooms, a private garden, and an outdoor thermal plunge pool.",
    price: 399,
    capacity: 4,
    size: 150,
    isAvailable: false,
    images: [
      {
        url: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80",
        alt: "Tranquility Villa Exterior"
      },
      {
        url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80",
        alt: "Tranquility Villa Living Room"
      },
      {
        url: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&q=80",
        alt: "Tranquility Villa Garden"
      }
    ],
    amenityIds: ["wifi", "kingBed", "queenBed", "capacity4"]
  },
  {
    id: 4,
    name: "Zen Garden Villa",
    description: "Our premium villa with a private Japanese-inspired garden, indoor and outdoor thermal baths.",
    price: 449,
    capacity: 2,
    size: 110,
    isAvailable: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80",
        alt: "Zen Garden Villa Exterior"
      },
      {
        url: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80",
        alt: "Zen Garden Villa Bedroom"
      },
      {
        url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80",
        alt: "Zen Garden Villa Garden"
      }
    ],
    amenityIds: ["wifi", "kingBed", "petFriendly", "capacity2"]
  },
  {
    id: 5,
    name: "Infinity Villa",
    description: "Luxury villa for larger groups with stunning infinity thermal pool overlooking the valley.",
    price: 599,
    capacity: 6,
    size: 200,
    isAvailable: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&q=80",
        alt: "Infinity Villa Exterior"
      },
      {
        url: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80",
        alt: "Infinity Villa Dining Area"
      },
      {
        url: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80",
        alt: "Infinity Villa Pool"
      }
    ],
    amenityIds: ["wifi", "kingBed", "queenBed", "capacity6"]
  }
];
