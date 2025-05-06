
import React, { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { 
  Edit, 
  Trash, 
  Dog
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { VillaProps } from '@/components/VillaCard';
import { useToast } from '@/hooks/use-toast';
import { initialVillasData } from '@/data/villas';
import { Amenity } from '@/components/VillaCard';
import { Dog as DogIcon, Wifi, Users, Bed } from 'lucide-react';

interface AdminVillasListProps {
  onEditVilla: (villa: VillaProps) => void;
}

const AdminVillasList = ({ onEditVilla }: AdminVillasListProps) => {
  // Create amenities map
  const amenitiesMap: Record<string, Amenity> = {
    wifi: { icon: <Wifi className="h-4 w-4" />, label: "Free Wi-Fi" },
    petFriendly: { icon: <DogIcon className="h-4 w-4" />, label: "Pet Friendly" },
    kingBed: { icon: <Bed className="h-4 w-4" />, label: "King Size Bed" },
    queenBed: { icon: <Bed className="h-4 w-4" />, label: "Queen Size Bed" },
    capacity2: { icon: <Users className="h-4 w-4" />, label: "2 Guests" },
    capacity4: { icon: <Users className="h-4 w-4" />, label: "4 Guests" },
    capacity6: { icon: <Users className="h-4 w-4" />, label: "6 Guests" }
  };
  
  // Process villas data to include actual amenity objects
  const processedVillas: VillaProps[] = initialVillasData.map(villa => ({
    ...villa,
    amenities: (villa as any).amenityIds.map((id: string) => amenitiesMap[id])
  }));
  
  const [villas, setVillas] = useState<VillaProps[]>(processedVillas);
  const { toast } = useToast();
  
  const toggleAvailability = (id: number) => {
    setVillas(prev => 
      prev.map(villa => 
        villa.id === id 
          ? { ...villa, isAvailable: !villa.isAvailable } 
          : villa
      )
    );
    toast({
      title: "Villa availability updated",
      description: "The villa's availability status has been updated successfully.",
    });
  };
  
  const togglePetFriendly = (id: number) => {
    setVillas(prev => 
      prev.map(villa => {
        if (villa.id === id) {
          // Toggle pet friendly by adding or removing the pet amenity
          const hasPets = villa.amenities.some(a => a.label === "Pet Friendly");
          let newAmenities = [...villa.amenities];
          
          if (hasPets) {
            newAmenities = newAmenities.filter(a => a.label !== "Pet Friendly");
          } else {
            // Add pet friendly amenity if not present
            newAmenities.push(amenitiesMap.petFriendly);
          }
          
          return { ...villa, amenities: newAmenities };
        }
        return villa;
      })
    );
    
    toast({
      title: "Pet policy updated",
      description: "The villa's pet policy has been updated successfully.",
    });
  };
  
  const deleteVilla = (id: number) => {
    if (window.confirm("Are you sure you want to delete this villa?")) {
      setVillas(prev => prev.filter(villa => villa.id !== id));
      toast({
        title: "Villa deleted",
        description: "The villa has been successfully removed.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-hypnotic-darker p-6 rounded-lg border border-white/10 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-white/10">
            <TableHead className="text-hypnotic-accent">Name</TableHead>
            <TableHead className="text-hypnotic-accent">Price</TableHead>
            <TableHead className="text-hypnotic-accent">Capacity</TableHead>
            <TableHead className="text-hypnotic-accent text-center">Available</TableHead>
            <TableHead className="text-hypnotic-accent text-center">Pet Friendly</TableHead>
            <TableHead className="text-hypnotic-accent text-center">Photos</TableHead>
            <TableHead className="text-hypnotic-accent text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {villas.map((villa) => {
            const isPetFriendly = villa.amenities.some(a => a.label === "Pet Friendly");
            
            return (
              <TableRow key={villa.id} className="border-b border-white/10">
                <TableCell className="font-medium">{villa.name}</TableCell>
                <TableCell>${villa.price}/night</TableCell>
                <TableCell>{villa.capacity} guests</TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={villa.isAvailable !== false}
                    onCheckedChange={() => toggleAvailability(villa.id)}
                    className="data-[state=checked]:bg-hypnotic-accent"
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={isPetFriendly}
                    onCheckedChange={() => togglePetFriendly(villa.id)}
                    className="data-[state=checked]:bg-hypnotic-accent"
                  />
                </TableCell>
                <TableCell className="text-center">
                  {villa.images.length} photos
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEditVilla(villa)}
                    >
                      <Edit className="h-4 w-4 text-hypnotic-accent" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteVilla(villa.id)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminVillasList;
