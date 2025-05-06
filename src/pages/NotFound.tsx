
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-hypnotic-dark text-white flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-6xl font-thin mb-8 text-hypnotic-accent">404</h1>
          <p className="text-2xl font-light mb-8">The page you're looking for cannot be found</p>
          <Button asChild className="bg-hypnotic-accent hover:bg-hypnotic-accent/90 mt-4">
            <a href="/">Return to Home</a>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
