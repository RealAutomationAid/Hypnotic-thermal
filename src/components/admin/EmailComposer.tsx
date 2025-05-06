
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Send, Mail } from 'lucide-react';

// Mock reservation data
const mockReservations = [
  { id: 1, guestName: 'John Doe', email: 'john@example.com', villaName: 'Serenity Villa', checkIn: '2025-06-01' },
  { id: 2, guestName: 'Jane Smith', email: 'jane@example.com', villaName: 'Harmony Villa', checkIn: '2025-06-05' },
  { id: 3, guestName: 'Robert Johnson', email: 'robert@example.com', villaName: 'Tranquility Villa', checkIn: '2025-06-10' },
];

// Template options
const templateOptions = [
  { value: 'custom', label: 'Custom Email' },
  { value: 'confirmation', label: 'Booking Confirmation' },
  { value: 'reminder', label: 'Check-in Reminder' },
  { value: 'welcome', label: 'Welcome Email' },
];

const EmailComposer = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('custom');
  const [selectedReservation, setSelectedReservation] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [recipients, setRecipients] = useState('');
  const { toast } = useToast();

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
    
    // In a real app, you would fetch the template content from your backend
    if (value !== 'custom') {
      // This is a simplified version, in a real app you would fetch the actual templates
      setSubject(`Template: ${templateOptions.find(t => t.value === value)?.label}`);
      setContent(`This is a placeholder for the ${value} template content. In a real application, this would be populated with the actual template content.`);
    } else {
      setSubject('');
      setContent('');
    }
  };

  const handleReservationChange = (value: string) => {
    setSelectedReservation(value);
    
    if (value) {
      const reservation = mockReservations.find(r => r.id.toString() === value);
      if (reservation) {
        setRecipients(reservation.email);
      }
    } else {
      setRecipients('');
    }
  };

  const handleSendEmail = () => {
    // In a real application, this would send the email to your backend
    toast({
      title: "Email Sent",
      description: `Email has been sent to ${recipients}.`,
    });
    
    // Reset form
    setSubject('');
    setContent('');
    setRecipients('');
    setSelectedReservation('');
    setSelectedTemplate('custom');
  };

  return (
    <Card className="bg-hypnotic-darker border-hypnotic-accent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail size={20} />
          Compose Email
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Template</label>
              <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                <SelectTrigger className="bg-hypnotic-dark border-hypnotic-accent">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {templateOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Reservation (Optional)</label>
              <Select value={selectedReservation} onValueChange={handleReservationChange}>
                <SelectTrigger className="bg-hypnotic-dark border-hypnotic-accent">
                  <SelectValue placeholder="Select reservation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {mockReservations.map(reservation => (
                    <SelectItem key={reservation.id} value={reservation.id.toString()}>
                      {reservation.guestName} - {reservation.villaName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">To</label>
            <Input
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="recipient@example.com"
              className="bg-hypnotic-dark border-hypnotic-accent"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              className="bg-hypnotic-dark border-hypnotic-accent"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              placeholder="Write your email content here..."
              className="bg-hypnotic-dark border-hypnotic-accent min-h-[200px]"
            />
          </div>
          
          <Button 
            onClick={handleSendEmail}
            className="w-full bg-hypnotic-accent hover:bg-hypnotic-accent/90 flex items-center gap-2"
            disabled={!recipients || !subject || !content}
          >
            <Send size={16} />
            Send Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailComposer;
