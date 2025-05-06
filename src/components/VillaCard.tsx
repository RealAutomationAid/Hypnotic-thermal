
import { useState } from "react";
import { Bed, Wifi, Users, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import BookingForm from "./BookingForm";

export interface Amenity {
  icon: JSX.Element;
  label: string;
}

export interface VillaImage {
  url: string;
  alt: string;
}

export interface VillaProps {
  id: number;
  name: string;
  description: string;
  price: number;
  capacity: number;
  size: number;
  images: VillaImage[];
  amenities: Amenity[];
}

const VillaCard = ({
  id,
  name,
  description,
  price,
  capacity,
  size,
  images,
  amenities
}: VillaProps) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="group bg-hypnotic-dark border border-white/5 hover:border-hypnotic-accent/20 rounded-lg overflow-hidden transition-all duration-300 flex flex-col h-full">
      <div className="relative">
        <div 
          className="h-64 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${images[0].url})` }}
        />
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full"
          onClick={() => setIsGalleryOpen(true)}
        >
          <Image className="h-5 w-5" />
        </Button>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-hypnotic-darker/90 to-transparent p-6 pt-16">
          <h3 className="text-xl font-light text-white">{name}</h3>
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <p className="text-hypnotic-gray text-sm mb-4">{description}</p>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center">
            <Users className="text-hypnotic-accent mr-2 h-4 w-4" />
            <span className="text-sm text-hypnotic-gray">Up to {capacity} guests</span>
          </div>
          <div className="flex items-center">
            <Bed className="text-hypnotic-accent mr-2 h-4 w-4" />
            <span className="text-sm text-hypnotic-gray">{size} m²</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-6">
          {amenities.slice(0, 4).map((amenity, index) => (
            <div key={index} className="flex items-center">
              <div className="text-hypnotic-accent mr-2">{amenity.icon}</div>
              <span className="text-xs text-hypnotic-gray">{amenity.label}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-auto flex items-end justify-between">
          <div>
            <div className="text-2xl font-light text-white">${price}</div>
            <div className="text-xs text-hypnotic-gray">per night</div>
          </div>
          <Button 
            onClick={() => setIsBookingFormOpen(true)}
            className="bg-hypnotic-accent hover:bg-hypnotic-accent/90"
          >
            Book Now
          </Button>
        </div>
      </div>
      
      {/* Gallery Dialog */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="bg-hypnotic-darker border-hypnotic-gray/20 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-light">{name} Gallery</DialogTitle>
          </DialogHeader>
          <div className="mt-4 relative">
            <div className="aspect-video overflow-hidden rounded-md">
              <img 
                src={images[currentImageIndex].url} 
                alt={images[currentImageIndex].alt}
                className="w-full h-full object-cover"
              />
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full"
              onClick={prevImage}
            >
              &lt;
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full"
              onClick={nextImage}
            >
              &gt;
            </Button>
            
            <div className="flex justify-center mt-4 space-x-2 overflow-x-auto px-4 py-2 no-scrollbar">
              {images.map((image, idx) => (
                <div 
                  key={idx} 
                  className={`w-16 h-12 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border-2 transition-all ${
                    currentImageIndex === idx ? 'border-hypnotic-accent' : 'border-transparent'
                  }`}
                  onClick={() => setCurrentImageIndex(idx)}
                >
                  <img 
                    src={image.url} 
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Booking Form Dialog */}
      {isBookingFormOpen && <BookingForm onClose={() => setIsBookingFormOpen(false)} />}
    </div>
  );
};

export default VillaCard;
