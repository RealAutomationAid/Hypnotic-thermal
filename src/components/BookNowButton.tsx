
import { useState } from "react";
import BookingForm from "./BookingForm";

const BookNowButton = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-8 right-8 z-40 bg-hypnotic-accent hover:bg-hypnotic-accent/90 text-white py-4 px-8 rounded-full shadow-lg font-medium tracking-wide transition-all duration-300 flex items-center justify-center group"
        aria-label="Book Now"
      >
        <span>BOOK NOW</span>
        <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
      </button>

      {isFormOpen && <BookingForm onClose={() => setIsFormOpen(false)} />}
    </>
  );
};

export default BookNowButton;
