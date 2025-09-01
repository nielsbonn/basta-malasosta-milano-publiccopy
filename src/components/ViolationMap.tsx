
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Map from 'ol/Map';
import { ViolationReport } from '@/types';
import ViolationFilters from './ViolationFilters';
import BaseMap from './map/BaseMap';
import HeatmapLayer from './map/HeatmapLayer';
import RefreshButton from './RefreshButton';

interface ViolationMapProps {
  violations: ViolationReport[];
  className?: string;
  selectedTypes: string[];
  onFilterChange: (types: string[]) => void;
  showWarning: boolean;
  onWarningDismiss: () => void;
  isFiltersOpen: boolean;
  onFiltersOpenChange: (isOpen: boolean) => void;
  onRefresh?: () => void;
}

const ViolationMap = ({ 
  violations, 
  className, 
  selectedTypes, 
  onFilterChange,
  showWarning,
  onWarningDismiss,
  isFiltersOpen,
  onFiltersOpenChange,
  onRefresh
}: ViolationMapProps) => {
  const [map, setMap] = useState<Map | null>(null);
  
  // Filter violations based on selected types
  const filteredViolations = violations.filter(violation => 
    selectedTypes.includes(violation.violationType)
  );

  const handleMapInit = useCallback((initializedMap: Map) => {
    setMap(initializedMap);
  }, []);

  return (
    <div className="relative">
      {showWarning && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-red-600 text-sm flex-1">
            <span className="font-bold">Segnalare le violazioni una sola volta.</span> Abbiate pazienza! Potrebbero essere necessari alcuni minuti e un aggiornamento perché vengano visualizzate sulla mappa.
          </p>
          {onRefresh && (
            <RefreshButton onRefresh={onRefresh} />
          )}
        </div>
      )}
      <ViolationFilters 
        selectedTypes={selectedTypes}
        onFilterChange={onFilterChange}
        isOpen={isFiltersOpen}
        onOpenChange={onFiltersOpenChange}
      />
      <div className="relative">
        <BaseMap 
          className={className} 
          onMapInit={handleMapInit}
        />
        {map && <HeatmapLayer map={map} violations={filteredViolations} />}
      </div>
      <p className="text-sm text-milano-gray mt-4 text-center">
        Sulla base di {filteredViolations.length} segnalazioni negli ultimi 30 giorni
      </p>
    </div>
  );
};

export default React.memo(ViolationMap);
