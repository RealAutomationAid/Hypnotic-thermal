
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Plus, Trash, Image, Dog, Wifi, Users, Bed } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { VillaProps, Amenity } from '@/components/VillaCard';
import { useToast } from '@/hooks/use-toast';

interface AdminVillaModalProps {
  villa: VillaProps | null;
  onClose: () => void;
}

const villaFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  price: z.number().positive({ message: 'Price must be positive' }),
  capacity: z.number().int().positive({ message: 'Capacity must be a positive integer' }),
  size: z.number().positive({ message: 'Size must be positive' }),
  isAvailable: z.boolean().optional(),
  isPetFriendly: z.boolean().optional(),
});

type VillaFormValues = z.infer<typeof villaFormSchema>;

const AdminVillaModal = ({ villa, onClose }: AdminVillaModalProps) => {
  const { toast } = useToast();
  const [amenities, setAmenities] = useState<Amenity[]>(villa?.amenities || []);
  const [images, setImages] = useState<{url: string; alt: string}[]>(villa?.images || []);
  const [newAmenityLabel, setNewAmenityLabel] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');

  const form = useForm<VillaFormValues>({
    resolver: zodResolver(villaFormSchema),
    defaultValues: {
      name: villa?.name || '',
      description: villa?.description || '',
      price: villa?.price || 0,
      capacity: villa?.capacity || 2,
      size: villa?.size || 0,
      isAvailable: villa?.isAvailable !== false,
      isPetFriendly: villa?.amenities?.some(a => a.label === "Pet Friendly") || false,
    },
  });

  // Available amenity icons to choose from
  const amenityIcons = {
    wifi: { icon: <Wifi className="h-4 w-4" />, label: "Free Wi-Fi" },
    pets: { icon: <Dog className="h-4 w-4" />, label: "Pet Friendly" },
    kingBed: { icon: <Bed className="h-4 w-4" />, label: "King Size Bed" },
    queenBed: { icon: <Bed className="h-4 w-4" />, label: "Queen Size Bed" },
    capacity2: { icon: <Users className="h-4 w-4" />, label: "2 Guests" },
    capacity4: { icon: <Users className="h-4 w-4" />, label: "4 Guests" },
    capacity6: { icon: <Users className="h-4 w-4" />, label: "6 Guests" },
  };
  
  const addAmenity = () => {
    if (newAmenityLabel.trim() !== '') {
      const newAmenity = {
        icon: <Bed className="h-4 w-4" />, // Default icon
        label: newAmenityLabel.trim()
      };
      setAmenities([...amenities, newAmenity]);
      setNewAmenityLabel('');
    }
  };
  
  const removeAmenity = (index: number) => {
    const newAmenities = [...amenities];
    newAmenities.splice(index, 1);
    setAmenities(newAmenities);
  };
  
  const addImage = () => {
    if (newImageUrl.trim() !== '') {
      const newImage = {
        url: newImageUrl.trim(),
        alt: newImageAlt.trim() || `${form.getValues('name')} image`
      };
      setImages([...images, newImage]);
      setNewImageUrl('');
      setNewImageAlt('');
    }
  };
  
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === images.length - 1)
    ) return;
    
    const newImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setImages(newImages);
  };
  
  const onSubmit = (data: VillaFormValues) => {
    // Here you would typically send the data to your API
    // For this demo, we'll just show a success toast
    
    // Check if we have at least one image
    if (images.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one image for the villa.",
        variant: "destructive",
      });
      return;
    }
    
    // Create or update villa object
    const updatedVilla: VillaProps = {
      id: villa?.id || Date.now(),
      name: data.name,
      description: data.description,
      price: data.price,
      capacity: data.capacity,
      size: data.size,
      images: images,
      amenities: amenities,
      isAvailable: data.isAvailable
    };
    
    // Add pet friendly amenity if checked
    if (data.isPetFriendly) {
      const hasPetAmenity = amenities.some(a => a.label === "Pet Friendly");
      if (!hasPetAmenity) {
        updatedVilla.amenities.push(amenityIcons.pets);
      }
    }
    
    // Show success message
    toast({
      title: villa ? "Villa updated" : "Villa created",
      description: `Villa "${data.name}" has been successfully ${villa ? "updated" : "created"}.`,
    });
    
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-hypnotic-darker border-hypnotic-gray/20 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-light">
            {villa ? 'Edit Villa' : 'Add New Villa'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg text-hypnotic-accent">Basic Information</h3>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Villa Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter villa name" 
                          className="bg-hypnotic-dark border-white/20"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <textarea
                          className="w-full rounded-md bg-hypnotic-dark border-white/20 p-3 min-h-24"
                          placeholder="Enter villa description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            className="bg-hypnotic-dark border-white/20"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            className="bg-hypnotic-dark border-white/20"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size (m²)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            className="bg-hypnotic-dark border-white/20"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex gap-8 pt-2">
                  <FormField
                    control={form.control}
                    name="isAvailable"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-hypnotic-accent"
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">Available for booking</FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isPetFriendly"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-hypnotic-accent"
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">Pet friendly</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Amenities */}
              <div className="space-y-4">
                <h3 className="text-lg text-hypnotic-accent">Amenities</h3>
                
                <div className="border border-white/10 rounded-md p-3 bg-hypnotic-dark">
                  {amenities.length === 0 ? (
                    <p className="text-hypnotic-gray text-center py-4">No amenities added yet</p>
                  ) : (
                    <ul className="space-y-2">
                      {amenities.map((amenity, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="text-hypnotic-accent">{amenity.icon}</div>
                            <span>{amenity.label}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeAmenity(index)}
                          >
                            <Trash className="h-3 w-3 text-hypnotic-gray" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="New amenity name"
                    value={newAmenityLabel}
                    onChange={(e) => setNewAmenityLabel(e.target.value)}
                    className="bg-hypnotic-dark border-white/20"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addAmenity}
                    className="border-hypnotic-accent text-hypnotic-accent"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Images Section */}
            <div className="space-y-4">
              <h3 className="text-lg text-hypnotic-accent">Photo Gallery</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video overflow-hidden rounded-md border border-white/10">
                      <img 
                        src={image.url} 
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-7 w-7 bg-black/50 hover:bg-black/70"
                        onClick={() => removeImage(index)}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                      {index > 0 && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-7 w-7 bg-black/50 hover:bg-black/70"
                          onClick={() => moveImage(index, 'up')}
                        >
                          <X className="h-3 w-3 rotate-45" />
                        </Button>
                      )}
                      {index < images.length - 1 && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-7 w-7 bg-black/50 hover:bg-black/70"
                          onClick={() => moveImage(index, 'down')}
                        >
                          <X className="h-3 w-3 -rotate-45" />
                        </Button>
                      )}
                    </div>
                    <div className="absolute bottom-2 left-2 text-xs bg-black/50 px-2 py-1 rounded">
                      {index === 0 ? 'Main photo' : `Photo ${index + 1}`}
                    </div>
                  </div>
                ))}
                
                <div className="aspect-video rounded-md border border-dashed border-white/20 flex flex-col items-center justify-center p-4">
                  <div className="flex flex-col gap-2 w-full">
                    <Input
                      placeholder="Image URL"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="bg-hypnotic-dark border-white/20"
                    />
                    <Input
                      placeholder="Image alt text (optional)"
                      value={newImageAlt}
                      onChange={(e) => setNewImageAlt(e.target.value)}
                      className="bg-hypnotic-dark border-white/20"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addImage}
                      className="mt-2 border-hypnotic-accent text-hypnotic-accent"
                    >
                      <Image className="h-4 w-4 mr-2" /> Add Image
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-white/20"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-hypnotic-accent hover:bg-hypnotic-accent/90"
              >
                {villa ? 'Update Villa' : 'Create Villa'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminVillaModal;
