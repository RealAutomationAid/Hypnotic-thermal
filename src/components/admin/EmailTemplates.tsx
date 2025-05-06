
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Edit, Save } from 'lucide-react';

type EmailTemplateType = 'confirmation' | 'reminder' | 'welcome';

interface EmailTemplate {
  id: EmailTemplateType;
  name: string;
  subject: string;
  content: string;
}

const defaultTemplates: EmailTemplate[] = [
  {
    id: 'confirmation',
    name: 'Booking Confirmation',
    subject: 'Your booking at Hypnotic Villas has been confirmed',
    content: `Dear {guest_name},

Thank you for booking with Hypnotic Villas! Your stay from {check_in} to {check_out} at {villa_name} has been confirmed.

Your booking details:
- Booking reference: {booking_id}
- Villa: {villa_name}
- Check-in date: {check_in}
- Check-out date: {check_out}
- Number of guests: {guests}

We're looking forward to welcoming you!

Best regards,
Hypnotic Villas Team`
  },
  {
    id: 'reminder',
    name: 'Check-in Reminder',
    subject: 'Reminder: Your stay at Hypnotic Villas begins soon',
    content: `Dear {guest_name},

We hope you're excited about your upcoming stay at {villa_name}!

This is a friendly reminder that your check-in date is approaching:
- Villa: {villa_name}
- Check-in date: {check_in} (from 3:00 PM)
- Check-out date: {check_out} (by 11:00 AM)
- Booking reference: {booking_id}

If you need directions or have any questions before arrival, please don't hesitate to contact us.

We're looking forward to welcoming you!

Best regards,
Hypnotic Villas Team`
  },
  {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to Hypnotic Villas!',
    content: `Dear {guest_name},

Welcome to Hypnotic Villas!

We're delighted that you've chosen to stay with us. Here's some useful information for your stay:

- WiFi Password: HypnoticGuest2025
- Breakfast hours: 7:00 AM - 10:00 AM
- Spa facilities: 9:00 AM - 8:00 PM
- Reception: Available 24/7

Your villa features a private thermal pool that is maintained daily. Please let us know if you need any assistance with operating the controls.

We hope you enjoy your stay!

Best regards,
Hypnotic Villas Team`
  }
];

const EmailTemplates = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>(defaultTemplates);
  const [editingId, setEditingId] = useState<EmailTemplateType | null>(null);
  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | null>(null);
  const { toast } = useToast();

  const handleEdit = (template: EmailTemplate) => {
    setCurrentTemplate({...template});
    setEditingId(template.id);
  };

  const handleSave = () => {
    if (!currentTemplate) return;
    
    setTemplates(templates.map(template => 
      template.id === currentTemplate.id ? currentTemplate : template
    ));
    
    setEditingId(null);
    setCurrentTemplate(null);
    
    toast({
      title: "Template updated",
      description: `The "${currentTemplate.name}" template has been updated successfully.`
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-light">Email Templates</h2>
      </div>

      <div className="grid gap-6">
        {templates.map(template => (
          <Card key={template.id} className="bg-hypnotic-darker border-hypnotic-accent">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{template.name}</CardTitle>
              {editingId === template.id ? (
                <Button onClick={handleSave} variant="outline" size="sm" className="flex items-center gap-2">
                  <Save size={16} />
                  Save
                </Button>
              ) : (
                <Button onClick={() => handleEdit(template)} variant="outline" size="sm" className="flex items-center gap-2">
                  <Edit size={16} />
                  Edit
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {editingId === template.id && currentTemplate ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Subject</label>
                    <Input 
                      value={currentTemplate.subject} 
                      onChange={(e) => setCurrentTemplate({...currentTemplate, subject: e.target.value})}
                      className="bg-hypnotic-dark border-hypnotic-accent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Content</label>
                    <Textarea 
                      value={currentTemplate.content}
                      onChange={(e) => setCurrentTemplate({...currentTemplate, content: e.target.value})}
                      rows={10}
                      className="bg-hypnotic-dark border-hypnotic-accent font-mono text-sm"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-hypnotic-accent">
                      Available variables: {'{guest_name}'}, {'{villa_name}'}, {'{check_in}'}, {'{check_out}'}, {'{booking_id}'}, {'{guests}'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Subject</label>
                    <div className="bg-hypnotic-dark p-2 rounded border border-hypnotic-accent/30">
                      {template.subject}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Content</label>
                    <div className="bg-hypnotic-dark p-2 rounded border border-hypnotic-accent/30 whitespace-pre-wrap font-mono text-sm">
                      {template.content}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmailTemplates;
