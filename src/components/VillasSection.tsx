
import { useState } from "react";
import VillaCard, { VillaProps } from "./VillaCard";
import { initialVillasData } from "@/data/villas";
import { Dog, Wifi, Users, Bed } from 'lucide-react';
import { Amenity } from "./VillaCard";

const VillasSection = () => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  
  // Define amenities map
  const amenitiesMap: Record<string, Amenity> = {
    wifi: { icon: <Wifi className="h-4 w-4" />, label: "Free Wi-Fi" },
    petFriendly: { icon: <Dog className="h-4 w-4" />, label: "Pet Friendly" },
    kingBed: { icon: <Bed className="h-4 w-4" />, label: "King Size Bed" },
    queenBed: { icon: <Bed className="h-4 w-4" />, label: "Queen Size Bed" },
    capacity2: { icon: <Users className="h-4 w-4" />, label: "2 Guests" },
    capacity4: { icon: <Users className="h-4 w-4" />, label: "4 Guests" },
    capacity6: { icon: <Users className="h-4 w-4" />, label: "6 Guests" }
  };
  
  // Process villas data to include actual amenity objects
  const villas: VillaProps[] = initialVillasData.map(villa => ({
    ...villa,
    amenities: (villa as any).amenityIds.map((id: string) => amenitiesMap[id])
  }));
  
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
