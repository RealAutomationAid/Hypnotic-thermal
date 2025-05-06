
import { useState } from 'react';
import { X, Calendar, Users, Dog, Phone, Mail, CreditCard } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface BookingFormProps {
  onClose: () => void;
}

const BookingForm = ({ onClose }: BookingFormProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    adults: 2,
    children: 0,
    hasPets: false,
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
    paymentMethod: 'stripe',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (name: string, value: number) => {
    if (value >= 0) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would handle the form submission, e.g., send to an API
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-hypnotic-darker text-white border-hypnotic-gray/20 max-w-3xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light tracking-wide">Book Your Stay</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dates Selection */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="date-range" className="text-sm font-light">SELECT YOUR DATES</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-hypnotic-dark border-hypnotic-gray/30",
                          !formData.dateFrom && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {formData.dateFrom ? format(formData.dateFrom, "PPP") : <span>Check-in date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-hypnotic-dark border-hypnotic-gray/30">
                      <CalendarComponent
                        mode="single"
                        selected={formData.dateFrom || undefined}
                        onSelect={(date) => setFormData(prev => ({ ...prev, dateFrom: date }))}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-hypnotic-dark border-hypnotic-gray/30",
                          !formData.dateTo && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {formData.dateTo ? format(formData.dateTo, "PPP") : <span>Check-out date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-hypnotic-dark border-hypnotic-gray/30">
                      <CalendarComponent
                        mode="single"
                        selected={formData.dateTo || undefined}
                        onSelect={(date) => setFormData(prev => ({ ...prev, dateTo: date }))}
                        initialFocus
                        disabled={(date) => 
                          formData.dateFrom ? date < formData.dateFrom : false
                        }
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-light">FIRST NAME</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="bg-hypnotic-dark border-hypnotic-gray/30"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-light">LAST NAME</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="bg-hypnotic-dark border-hypnotic-gray/30"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-light">EMAIL</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-hypnotic-gray" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-hypnotic-dark border-hypnotic-gray/30 pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-light">PHONE</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-hypnotic-gray" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="bg-hypnotic-dark border-hypnotic-gray/30 pl-10"
                  required
                />
              </div>
            </div>

            {/* Number of Guests */}
            <div className="space-y-2">
              <Label className="text-sm font-light">ADULTS</Label>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-hypnotic-gray" />
                <div className="flex border border-hypnotic-gray/30 rounded-md">
                  <button
                    type="button"
                    onClick={() => handleNumberChange('adults', formData.adults - 1)}
                    className="px-3 py-1 border-r border-hypnotic-gray/30 hover:bg-hypnotic-dark/50"
                    disabled={formData.adults <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 bg-hypnotic-dark">{formData.adults}</span>
                  <button
                    type="button"
                    onClick={() => handleNumberChange('adults', formData.adults + 1)}
                    className="px-3 py-1 border-l border-hypnotic-gray/30 hover:bg-hypnotic-dark/50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-light">CHILDREN</Label>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-hypnotic-gray" />
                <div className="flex border border-hypnotic-gray/30 rounded-md">
                  <button
                    type="button"
                    onClick={() => handleNumberChange('children', formData.children - 1)}
                    className="px-3 py-1 border-r border-hypnotic-gray/30 hover:bg-hypnotic-dark/50"
                    disabled={formData.children <= 0}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 bg-hypnotic-dark">{formData.children}</span>
                  <button
                    type="button"
                    onClick={() => handleNumberChange('children', formData.children + 1)}
                    className="px-3 py-1 border-l border-hypnotic-gray/30 hover:bg-hypnotic-dark/50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Pets */}
            <div className="space-y-2">
              <Label className="text-sm font-light">PETS ALLOWED</Label>
              <div className="flex items-center space-x-2">
                <Dog className="h-4 w-4 text-hypnotic-gray" />
                <span>Bringing pets?</span>
                <Switch
                  checked={formData.hasPets}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasPets: checked }))}
                  className="ml-2 data-[state=checked]:bg-hypnotic-accent"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2 col-span-2">
              <Label className="text-sm font-light">PAYMENT METHOD</Label>
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="stripe" id="stripe" />
                  <Label htmlFor="stripe" className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Credit Card (Stripe)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank">Bank Transfer</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Additional Information */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="message" className="text-sm font-light">SPECIAL REQUESTS</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Any special requirements or requests..."
                value={formData.message}
                onChange={handleInputChange}
                className="bg-hypnotic-dark border-hypnotic-gray/30 min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 mt-4 border-t border-hypnotic-gray/20">
            <Button 
              type="button" 
              onClick={onClose} 
              variant="outline"
              className="border-hypnotic-gray/30 hover:bg-hypnotic-dark"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-hypnotic-accent hover:bg-hypnotic-accent/90"
            >
              Book Now
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;
