
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminVillasList from '@/components/admin/AdminVillasList';
import AdminVillaModal from '@/components/admin/AdminVillaModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { VillaProps } from '@/components/VillaCard';

const Admin = () => {
  const [isAddVillaModalOpen, setIsAddVillaModalOpen] = useState(false);
  const [editingVilla, setEditingVilla] = useState<VillaProps | null>(null);
  
  const handleAddVilla = () => {
    setEditingVilla(null);
    setIsAddVillaModalOpen(true);
  };
  
  const handleEditVilla = (villa: VillaProps) => {
    setEditingVilla(villa);
    setIsAddVillaModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsAddVillaModalOpen(false);
    setEditingVilla(null);
  };

  return (
    <div className="min-h-screen bg-hypnotic-dark text-white">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-light">Villa Management</h1>
          <Button 
            onClick={handleAddVilla}
            className="bg-hypnotic-accent hover:bg-hypnotic-accent/90 flex items-center gap-2"
          >
            <Plus size={16} />
            Add New Villa
          </Button>
        </div>
        
        <AdminVillasList onEditVilla={handleEditVilla} />
        
        {isAddVillaModalOpen && (
          <AdminVillaModal 
            villa={editingVilla} 
            onClose={handleCloseModal} 
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
