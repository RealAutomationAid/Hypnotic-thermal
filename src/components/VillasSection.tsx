
import { useState } from "react";
import { Bed, Wifi, Users, Dog } from "lucide-react";
import VillaCard, { Amenity, VillaProps } from "./VillaCard";

const VillasSection = () => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  
  const amenities: Record<string, Amenity> = {
    wifi: { icon: <Wifi className="h-4 w-4" />, label: "Free Wi-Fi" },
    pets: { icon: <Dog className="h-4 w-4" />, label: "Pet Friendly" },
    kingBed: { icon: <Bed className="h-4 w-4" />, label: "King Size Bed" },
    queenBed: { icon: <Bed className="h-4 w-4" />, label: "Queen Size Bed" },
    capacity2: { icon: <Users className="h-4 w-4" />, label: "2 Guests" },
    capacity4: { icon: <Users className="h-4 w-4" />, label: "4 Guests" },
    capacity6: { icon: <Users className="h-4 w-4" />, label: "6 Guests" },
  };
  
  const villas: VillaProps[] = [
    {
      id: 1,
      name: "Serenity Villa",
      description: "Our most secluded villa with private thermal pool and panoramic mountain views, perfect for couples.",
      price: 299,
      capacity: 2,
      size: 85,
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
        amenities.wifi,
        amenities.kingBed,
        amenities.capacity2
      ]
    },
    {
      id: 2,
      name: "Harmony Villa",
      description: "Modern villa with a blend of contemporary design and natural elements, featuring a private steam room.",
      price: 349,
      capacity: 4,
      size: 120,
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
        amenities.wifi,
        amenities.pets,
        amenities.queenBed,
        amenities.capacity4
      ]
    },
    {
      id: 3,
      name: "Tranquility Villa",
      description: "Spacious family villa with two bedrooms, a private garden, and an outdoor thermal plunge pool.",
      price: 399,
      capacity: 4,
      size: 150,
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
        amenities.wifi,
        amenities.kingBed,
        amenities.queenBed,
        amenities.capacity4
      ]
    },
    {
      id: 4,
      name: "Zen Garden Villa",
      description: "Our premium villa with a private Japanese-inspired garden, indoor and outdoor thermal baths.",
      price: 449,
      capacity: 2,
      size: 110,
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
        amenities.wifi,
        amenities.kingBed,
        amenities.pets,
        amenities.capacity2
      ]
    },
    {
      id: 5,
      name: "Infinity Villa",
      description: "Luxury villa for larger groups with stunning infinity thermal pool overlooking the valley.",
      price: 599,
      capacity: 6,
      size: 200,
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
        amenities.wifi,
        amenities.kingBed,
        amenities.queenBed,
        amenities.capacity6
      ]
    }
  ];
  
  const categories = [
    { id: 1, name: "Couples", filter: (villa: VillaProps) => villa.capacity === 2 },
    { id: 2, name: "Family", filter: (villa: VillaProps) => villa.capacity >= 4 },
    { id: 3, name: "Pet Friendly", filter: (villa: VillaProps) => villa.amenities.some(a => a.label === "Pet Friendly") },
  ];
  
  const filteredVillas = activeCategory 
    ? villas.filter(categories.find(c => c.id === activeCategory)?.filter || (() => true)) 
    : villas;

  return (
    <div className="py-20 bg-hypnotic-darker">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-3">Our Luxurious Villas</h2>
          <p className="text-hypnotic-gray max-w-2xl mx-auto">
            Discover our collection of private thermal villas, each offering a unique experience 
            with its own thermal pool and exclusive amenities.
          </p>
        </div>
        
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button 
            onClick={() => setActiveCategory(null)} 
            className={`px-6 py-2 rounded-full transition-all ${
              activeCategory === null 
                ? "bg-hypnotic-accent text-white" 
                : "bg-hypnotic-dark text-hypnotic-gray hover:text-white"
            }`}
          >
            All Villas
          </button>
          
          {categories.map(category => (
            <button 
              key={category.id}
              onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)} 
              className={`px-6 py-2 rounded-full transition-all ${
                activeCategory === category.id 
                  ? "bg-hypnotic-accent text-white" 
                  : "bg-hypnotic-dark text-hypnotic-gray hover:text-white"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Villas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVillas.map(villa => (
            <VillaCard key={villa.id} {...villa} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VillasSection;
