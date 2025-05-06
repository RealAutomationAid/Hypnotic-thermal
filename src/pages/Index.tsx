
import React from 'react';
import HeroSection from '@/components/HeroSection';
import VillasSection from '@/components/VillasSection';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookNowButton from '@/components/BookNowButton';

const Index = () => {
  return (
    <div className="min-h-screen bg-hypnotic-dark text-white">
      <Header />
      <main>
        <HeroSection />
        <VillasSection />
      </main>
      <Footer />
      <BookNowButton />
    </div>
  );
};

export default Index;
