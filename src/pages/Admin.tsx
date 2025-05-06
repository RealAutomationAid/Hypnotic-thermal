
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminVillasList from '@/components/admin/AdminVillasList';
import AdminVillaModal from '@/components/admin/AdminVillaModal';
import AdminReservations from '@/components/admin/AdminReservations';
import AdminTaskBoard from '@/components/admin/AdminTaskBoard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Mail } from 'lucide-react';
import { VillaProps } from '@/components/VillaCard';
import { Link } from 'react-router-dom';

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
          <h1 className="text-3xl font-light">Admin Dashboard</h1>
          <Button 
            asChild
            variant="outline"
            className="flex items-center gap-2 border-hypnotic-accent text-hypnotic-accent"
          >
            <Link to="/admin/communication">
              <Mail size={16} />
              Communication Management
            </Link>
          </Button>
        </div>
        
        <Tabs defaultValue="villas" className="w-full">
          <TabsList className="bg-hypnotic-darker mb-8">
            <TabsTrigger value="villas">Villa Management</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
            <TabsTrigger value="tasks">Task Board</TabsTrigger>
          </TabsList>
          
          <TabsContent value="villas">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-light">Villa Management</h2>
              <Button 
                onClick={handleAddVilla}
                className="bg-hypnotic-accent hover:bg-hypnotic-accent/90 flex items-center gap-2"
              >
                <Plus size={16} />
                Add New Villa
              </Button>
            </div>
            <AdminVillasList onEditVilla={handleEditVilla} />
          </TabsContent>
          
          <TabsContent value="reservations">
            <AdminReservations />
          </TabsContent>
          
          <TabsContent value="tasks">
            <AdminTaskBoard />
          </TabsContent>
        </Tabs>
        
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
