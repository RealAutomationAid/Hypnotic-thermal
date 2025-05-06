
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-hypnotic-darker py-16 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo and About */}
          <div className="space-y-4">
            <Link to="/" className="flex flex-col">
              <h2 className="text-2xl font-thin tracking-wider text-white">
                HYPNOTIC
                <span className="block text-xs tracking-widest text-hypnotic-green mt-1">
                  THERMAL VILLAS & SPA
                </span>
              </h2>
            </Link>
            <p className="text-sm text-hypnotic-gray mt-4 pr-4">
              Escape to our exclusive thermal villas for a luxurious retreat surrounded by nature, 
              offering privacy and rejuvenation in a serene environment.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-light text-white pb-2 border-b border-white/10">Explore</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-hypnotic-gray hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/villas" className="text-hypnotic-gray hover:text-white transition-colors">
                Our Villas
              </Link>
              <Link to="/spa" className="text-hypnotic-gray hover:text-white transition-colors">
                Spa & Wellness
              </Link>
              <Link to="/about" className="text-hypnotic-gray hover:text-white transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="text-hypnotic-gray hover:text-white transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-light text-white pb-2 border-b border-white/10">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Phone className="w-4 h-4 text-hypnotic-accent mt-1 mr-2" />
                <span className="text-hypnotic-gray">+359 888 123 456</span>
              </div>
              <div className="flex items-start">
                <Mail className="w-4 h-4 text-hypnotic-accent mt-1 mr-2" />
                <span className="text-hypnotic-gray">info@hypnotic-villas.com</span>
              </div>
              <div className="text-hypnotic-gray ml-6 mt-2">
                123 Mineral Springs Road<br />
                Sofia Region, 1000<br />
                Bulgaria
              </div>
            </div>
          </div>

          {/* Social and Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-light text-white pb-2 border-b border-white/10">Connect</h3>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-hypnotic-dark flex items-center justify-center hover:bg-hypnotic-accent/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-hypnotic-dark flex items-center justify-center hover:bg-hypnotic-accent/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-hypnotic-dark flex items-center justify-center hover:bg-hypnotic-accent/20 transition-colors"
                aria-label="TikTok"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
                  <path d="M15 8h.01" />
                  <path d="M15 2h-4a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V10a4 4 0 0 0-4-4Z" />
                </svg>
              </a>
            </div>
            
            <div className="flex space-x-4 mt-6">
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
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center">
          <div className="text-hypnotic-gray text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Hypnotic Thermal Villas & SPA. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy" className="text-hypnotic-gray hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-hypnotic-gray hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
