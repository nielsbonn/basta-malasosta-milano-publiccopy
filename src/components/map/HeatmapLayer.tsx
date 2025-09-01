
import React, { useEffect, useRef, useMemo } from 'react';
import Map from 'ol/Map';
import Heatmap from 'ol/layer/Heatmap';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { ViolationReport } from '@/types';

interface HeatmapLayerProps {
  map: Map;
  violations: ViolationReport[];
}

const HeatmapLayer = ({ map, violations }: HeatmapLayerProps) => {
  const heatmapLayerRef = useRef<Heatmap | null>(null);

  // Memoize features creation to prevent unnecessary recalculations
  const features = useMemo(() => 
    violations.map(violation => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([violation.longitude, violation.latitude]))
      });
      feature.set('weight', 1);
      return feature;
    }), [violations]
  );

  // Memoize vector source creation
  const vectorSource = useMemo(() => 
    new VectorSource({
      features: features
    }), [features]
  );

  useEffect(() => {
    if (!map || !violations.length) return;

    // Remove existing heatmap layer if it exists
    if (heatmapLayerRef.current) {
      map.removeLayer(heatmapLayerRef.current);
      heatmapLayerRef.current = null;
    }

    // Create new heatmap layer with proper configuration
    const newHeatmapLayer = new Heatmap({
      source: vectorSource,
      blur: 15,
      radius: 10,
      weight: function(feature) {
        return feature.get('weight');
      },
      gradient: ['#00f', '#0ff', '#0f0', '#ff0', '#f00']
    });

    map.addLayer(newHeatmapLayer);
    heatmapLayerRef.current = newHeatmapLayer;

    return () => {
      if (heatmapLayerRef.current) {
        map.removeLayer(heatmapLayerRef.current);
      }
    };
  }, [map, vectorSource, violations.length]);

  return null;
};

export default React.memo(HeatmapLayer);
