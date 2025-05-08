import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailTemplates from '@/components/admin/EmailTemplates';
import EmailComposer from '@/components/admin/EmailComposer';
import UserRoles from '@/components/admin/UserRoles';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { LogOut, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

const AdminCommunication = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("templates");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-hypnotic-dark text-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-hypnotic-accent">Communication Management</h1>
            <p className="text-gray-400 mt-1">Manage email templates and user communications</p>
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
            
            <Link to="/admin">
              <Button className="bg-hypnotic-accent hover:bg-hypnotic-accent/80 text-black">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
        
        {user && (
          <p className="text-gray-400 mb-6">Logged in as: {user.name} ({user.email})</p>
        )}
        
        <Tabs defaultValue="templates" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="templates">Email Templates</TabsTrigger>
            <TabsTrigger value="composer">Email Composer</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates">
            <EmailTemplates />
          </TabsContent>
          
          <TabsContent value="composer">
            <EmailComposer />
          </TabsContent>
          
          <TabsContent value="users">
            <UserRoles />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminCommunication;
