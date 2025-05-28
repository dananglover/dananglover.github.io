import { Button } from '@/components/ui/button';
import { PlaceType } from '@/types';
import React from 'react';

interface PlaceFiltersProps {
  placeTypes: PlaceType[];
  selectedType: string;
  onTypeChange: (typeId: string) => void;
}

export const PlaceFilters: React.FC<PlaceFiltersProps> = ({
  placeTypes,
  selectedType,
  onTypeChange,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Filter by Type</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedType === '' ? 'default' : 'outline'}
          onClick={() => onTypeChange('')}
          className="rounded-full"
        >
          All
        </Button>
        
        {placeTypes.map((type) => (
          <Button
            key={type.id}
            variant={selectedType === type.id ? 'default' : 'outline'}
            onClick={() => onTypeChange(type.id)}
            className="rounded-full"
          >
            {type.name}
          </Button>
        ))}
      </div>
    </div>
  );
}; 