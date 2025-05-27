import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload } from 'lucide-react';
import { placeService } from '@/services/PlaceService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { CreatePlaceForm } from '@/types';

const CreatePlace = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: placeTypes } = useQuery({
    queryKey: ['placeTypes'],
    queryFn: () => placeService.getPlaceTypes()
  });

  const [formData, setFormData] = useState<CreatePlaceForm>({
    name: '',
    description: '',
    price: '',
    placeTypeId: '',
    location: '',
    photos: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, placeTypeId: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        photos: Array.from(e.target.files || [])
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a place.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Submitting form...', {
        name: formData.name,
        photoCount: formData.photos.length,
        userId: user.id
      });

      await placeService.createPlace(formData, user.id);
      
      toast({
        title: "Success!",
        description: "Your place has been added successfully.",
      });
      navigate('/places');
    } catch (error) {
      console.error('Error creating place:', error);
      
      // Show a more detailed error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred. Please try again.';
      
      toast({
        title: "Error Creating Place",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            className="mb-8"
            onClick={() => navigate('/places')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Places
          </Button>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Place</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Place Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter place name"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Describe this place..."
                  rows={4}
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range
                </label>
                <Input
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., $10-20 or 200k-500k VND"
                />
              </div>

              <div>
                <label htmlFor="placeType" className="block text-sm font-medium text-gray-700 mb-1">
                  Place Type
                </label>
                <Select
                  value={formData.placeTypeId}
                  onValueChange={handleTypeChange}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {placeTypes?.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter location or address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photos
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="photos"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none"
                      >
                        <span>Upload photos</span>
                        <input
                          id="photos"
                          name="photos"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="sr-only"
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB each
                    </p>
                  </div>
                </div>
                {formData.photos.length > 0 && (
                  <p className="mt-2 text-sm text-gray-500">
                    {formData.photos.length} photo(s) selected
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Place'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePlace; 