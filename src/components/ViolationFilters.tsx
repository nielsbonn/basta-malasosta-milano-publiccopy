import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { violationTypesList } from '@/types';

interface ViolationFiltersProps {
  selectedTypes: string[];
  onFilterChange: (types: string[]) => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const ViolationFilters = ({ 
  selectedTypes, 
  onFilterChange,
  isOpen,
  onOpenChange
}: ViolationFiltersProps) => {
  const handleCheckboxChange = (typeId: string, checked: boolean) => {
    if (checked) {
      onFilterChange([...selectedTypes, typeId]);
    } else {
      onFilterChange(selectedTypes.filter(type => type !== typeId));
    }
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className="bg-white rounded-lg shadow mb-4"
    >
      <CollapsibleTrigger className="w-full">
        <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
          <h3 className="text-lg font-semibold">Filtra Violazioni</h3>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-4 pb-4 pt-2 space-y-3">
          {violationTypesList.map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox
                id={type.id}
                checked={selectedTypes.includes(type.id)}
                onCheckedChange={(checked) => handleCheckboxChange(type.id, checked as boolean)}
              />
              <Label htmlFor={type.id}>{type.name}</Label>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ViolationFilters;