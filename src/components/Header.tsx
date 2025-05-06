
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Facebook, Instagram } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-hypnotic-darker/80 backdrop-blur-md py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl md:text-3xl font-thin tracking-wider text-white">
            HYPNOTIC
            <span className="block text-xs tracking-widest text-hypnotic-green mt-1">
              THERMAL VILLAS & SPA
            </span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link to="/" className="text-white/90 hover:text-hypnotic-accent transition-colors">
            Home
          </Link>
          <Link to="/villas" className="text-white/90 hover:text-hypnotic-accent transition-colors">
            Villas
          </Link>
          <Link to="/spa" className="text-white/90 hover:text-hypnotic-accent transition-colors">
            Spa
          </Link>
          <Link to="/about" className="text-white/90 hover:text-hypnotic-accent transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-white/90 hover:text-hypnotic-accent transition-colors">
            Contact
          </Link>

          <div className="flex space-x-4 ml-6">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook className="w-5 h-5 text-white/70 hover:text-hypnotic-accent transition-colors" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram className="w-5 h-5 text-white/70 hover:text-hypnotic-accent transition-colors" />
            </a>
          </div>

          <div className="flex space-x-4 ml-4 border-l border-white/20 pl-4">
            <a 
              href="https://bg.hypnotic.automationaid.eu" 
              className="text-hypnotic-gray hover:text-white transition-colors"
            >
              🇧🇬
            </a>
            <a 
              href="https://en.hypnotic.automationaid.eu" 
              className="text-white transition-colors"
            >
              🇬🇧
            </a>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-hypnotic-darker/95 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-6">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-white/90 hover:text-hypnotic-accent transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/villas" 
                className="text-white/90 hover:text-hypnotic-accent transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Villas
              </Link>
              <Link 
                to="/spa" 
                className="text-white/90 hover:text-hypnotic-accent transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Spa
              </Link>
              <Link 
                to="/about" 
                className="text-white/90 hover:text-hypnotic-accent transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-white/90 hover:text-hypnotic-accent transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              <div className="flex space-x-6 pt-4 border-t border-white/10">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Facebook className="w-5 h-5 text-white/70 hover:text-hypnotic-accent transition-colors" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram className="w-5 h-5 text-white/70 hover:text-hypnotic-accent transition-colors" />
                </a>
              </div>
              
              <div className="flex space-x-6 pt-4">
                <a 
                  href="https://bg.hypnotic.automationaid.eu" 
                  className="text-hypnotic-gray hover:text-white transition-colors"
                >
                  🇧🇬 Bulgarian
                </a>
                <a 
                  href="https://en.hypnotic.automationaid.eu" 
                  className="text-white transition-colors"
                >
                  🇬🇧 English
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
