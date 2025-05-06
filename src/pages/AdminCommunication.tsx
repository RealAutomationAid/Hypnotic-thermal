
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailTemplates from '@/components/admin/EmailTemplates';
import EmailComposer from '@/components/admin/EmailComposer';
import UserRoles from '@/components/admin/UserRoles';
import { useToast } from '@/hooks/use-toast';

const AdminCommunication = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("templates");

  return (
    <div className="min-h-screen bg-hypnotic-dark text-white">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-light mb-8">Communication Management</h1>
        
        <Tabs defaultValue="templates" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="bg-hypnotic-darker mb-8">
            <TabsTrigger value="templates">Email Templates</TabsTrigger>
            <TabsTrigger value="composer">Send Email</TabsTrigger>
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
