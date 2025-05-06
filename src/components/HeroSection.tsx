
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import BookingForm from "./BookingForm";

interface HeroSlide {
  image: string;
  heading: string;
  subheading: string;
}

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  
  const slides: HeroSlide[] = [
    {
      image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80",
      heading: "Escape to Thermal Luxury",
      subheading: "Experience the pinnacle of relaxation in our exclusive spa villas",
    },
    {
      image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&q=80",
      heading: "Immerse in Tranquility",
      subheading: "Secluded villas with natural thermal springs and panoramic views",
    },
    {
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80",
      heading: "Nature Meets Luxury",
      subheading: "Discover perfect harmony in our eco-friendly thermal retreats",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          style={{
            zIndex: index === currentSlide ? 1 : 0,
          }}
        >
          {/* Background Image */}
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-hypnotic-darker/70 via-transparent to-hypnotic-darker" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
            <h1 className="text-4xl md:text-6xl font-light text-white mb-4 max-w-4xl text-shadow animate-fade-in">
              {slide.heading}
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl text-shadow animate-fade-in">
              {slide.subheading}
            </p>
            <div className="mt-8 animate-fade-in">
              <Button 
                onClick={() => setIsBookingFormOpen(true)}
                className="bg-hypnotic-accent hover:bg-hypnotic-accent/90 text-white px-8 py-6 text-lg"
              >
                Book Your Stay
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-0 right-0 z-10 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Booking Form Dialog */}
      {isBookingFormOpen && <BookingForm onClose={() => setIsBookingFormOpen(false)} />}
    </div>
  );
};

export default HeroSection;
