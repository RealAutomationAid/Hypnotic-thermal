import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminVillasList from '@/components/admin/AdminVillasList';
import AdminVillaModal from '@/components/admin/AdminVillaModal';
import AdminReservations from '@/components/admin/AdminReservations';
import AdminTaskBoard from '@/components/admin/AdminTaskBoard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Mail, LogOut } from 'lucide-react';
import { VillaProps } from '@/components/VillaCard';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import SupabaseAuth from '@/lib/SupabaseService';

const Admin = () => {
  const [isAddVillaModalOpen, setIsAddVillaModalOpen] = useState(false);
  const [editingVilla, setEditingVilla] = useState<VillaProps | null>(null);
  const [activeTab, setActiveTab] = useState("villas");
  const [username, setUsername] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Extract username when component mounts and verify authentication
  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        // Double-check authentication state when component mounts
        const isAuthenticated = await SupabaseAuth.isAuthenticated();
        
        if (!isAuthenticated && !user) {
          console.log("Admin verification failed - redirecting to login");
          navigate('/login');
          return;
        }
        
        // Set adminLoggedIn flag
        localStorage.setItem('adminLoggedIn', 'true');
        
        // Extract username from user data
        if (user) {
          const extractedUsername = SupabaseAuth.getUsernameFromUser(user);
          setUsername(extractedUsername);
        }
      } catch (error) {
        console.error("Error verifying admin access:", error);
        navigate('/login');
      }
    };
    
    verifyAdmin();
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      // Use the Supabase service
      await SupabaseAuth.logout();
      
      // If context logout is available, use that too
      if (logout) {
        try {
          await logout();
        } catch (err) {
          console.log('Context logout failed, but direct logout succeeded');
        }
      }
      
      // Clear localStorage flags
      localStorage.removeItem('adminLoggedIn');
      
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const openAddVillaModal = () => {
    setEditingVilla(null);
    setIsAddVillaModalOpen(true);
  };

  const openEditVillaModal = (villa: VillaProps) => {
    setEditingVilla(villa);
    setIsAddVillaModalOpen(true);
  };

  const closeVillaModal = () => {
    setIsAddVillaModalOpen(false);
    setEditingVilla(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-hypnotic-dark text-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-hypnotic-accent">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage your properties and bookings</p>
          </div>
          
          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              className="border-hypnotic-accent text-hypnotic-accent hover:bg-hypnotic-accent hover:text-black"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
            
            <Link to="/admin/communication">
              <Button className="bg-hypnotic-accent hover:bg-hypnotic-accent/80 text-black">
                <Mail className="mr-2 h-4 w-4" />
                Communications
              </Button>
            </Link>
          </div>
        </div>
        
        {username && (
          <p className="text-gray-400 mb-6">Logged in as: {username}</p>
        )}
        
        <Tabs defaultValue="villas" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="villas">Villas</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="villas" className="space-y-4">
            <div className="flex justify-end mb-4">
              <Button onClick={openAddVillaModal} className="bg-hypnotic-accent hover:bg-hypnotic-accent/80 text-black">
                <Plus className="mr-2 h-4 w-4" />
                Add Villa
              </Button>
            </div>
            <AdminVillasList onEditVilla={openEditVillaModal} />
          </TabsContent>
          
          <TabsContent value="reservations">
            <AdminReservations />
          </TabsContent>
          
          <TabsContent value="tasks">
            <AdminTaskBoard />
          </TabsContent>
        </Tabs>
      </main>
      
      {isAddVillaModalOpen && (
        <AdminVillaModal 
          villa={editingVilla} 
          onClose={closeVillaModal} 
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Admin;
