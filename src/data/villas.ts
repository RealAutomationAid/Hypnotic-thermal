
import { Dog, Wifi, Users, Bed } from 'lucide-react';
import { VillaProps } from '@/components/VillaCard';

export const initialVillasData: VillaProps[] = [
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
    amenities: [
      { icon: <Wifi className="h-4 w-4" />, label: "Free Wi-Fi" },
      { icon: <Bed className="h-4 w-4" />, label: "King Size Bed" },
      { icon: <Users className="h-4 w-4" />, label: "2 Guests" }
    ]
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
    amenities: [
      { icon: <Wifi className="h-4 w-4" />, label: "Free Wi-Fi" },
      { icon: <Dog className="h-4 w-4" />, label: "Pet Friendly" },
      { icon: <Bed className="h-4 w-4" />, label: "Queen Size Bed" },
      { icon: <Users className="h-4 w-4" />, label: "4 Guests" }
    ]
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
    amenities: [
      { icon: <Wifi className="h-4 w-4" />, label: "Free Wi-Fi" },
      { icon: <Bed className="h-4 w-4" />, label: "King Size Bed" },
      { icon: <Bed className="h-4 w-4" />, label: "Queen Size Bed" },
      { icon: <Users className="h-4 w-4" />, label: "4 Guests" }
    ]
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
    amenities: [
      { icon: <Wifi className="h-4 w-4" />, label: "Free Wi-Fi" },
      { icon: <Bed className="h-4 w-4" />, label: "King Size Bed" },
      { icon: <Dog className="h-4 w-4" />, label: "Pet Friendly" },
      { icon: <Users className="h-4 w-4" />, label: "2 Guests" }
    ]
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
    amenities: [
      { icon: <Wifi className="h-4 w-4" />, label: "Free Wi-Fi" },
      { icon: <Bed className="h-4 w-4" />, label: "King Size Bed" },
      { icon: <Bed className="h-4 w-4" />, label: "Queen Size Bed" },
      { icon: <Users className="h-4 w-4" />, label: "6 Guests" }
    ]
  }
];
