
import React, { useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { violationTypesList } from '@/types';

interface ViolationTypeSelectorProps {
  onSelect: (violationType: string) => void;
  value: string | null;
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ViolationTypeSelector = ({ onSelect, value, disabled, onOpenChange }: ViolationTypeSelectorProps) => {
  const handleSelect = (selectedValue: string) => {
    onSelect(selectedValue);
    // Ensure the dropdown is marked as closed when a selection is made
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  // Force undefined instead of null for the Select value prop
  const selectValue = value === null ? undefined : value;

  // Handle open state changes directly from the Select component
  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      // Use setTimeout to ensure this runs after all other event handlers
      // This helps avoid race conditions in state updates
      setTimeout(() => {
        onOpenChange(open);
      }, 0);
    }
  };

  return (
    <div className="space-y-2 relative">
      <label className="text-sm font-medium">Tipo di Violazione</label>
      <Select 
        key={selectValue} // Add key to force re-render when value changes
        onValueChange={handleSelect} 
        value={selectValue}
        disabled={disabled}
        onOpenChange={handleOpenChange}
      >
        <SelectTrigger className="relative z-20">
          <SelectValue placeholder="Seleziona tipo di violazione" />
        </SelectTrigger>
        <SelectContent className="z-50 bg-white">
          {violationTypesList.map((type) => (
            <SelectItem 
              key={type.id} 
              value={type.id}
              className="relative z-50"
            >
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ViolationTypeSelector;
