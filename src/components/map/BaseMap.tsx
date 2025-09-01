
import { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import Control from 'ol/control/Control';
import Geolocation from 'ol/Geolocation';
import 'ol/ol.css';
import { cn } from '@/lib/utils';

// Create a custom geolocation control
class GeolocationControl extends Control {
  private geolocation: Geolocation | null = null;
  
  constructor(opt_options?: any) {
    const options = opt_options || {};

    const button = document.createElement('button');
    button.innerHTML = '⌖';  // Changed to a crosshair symbol
    button.className = 'ol-control-custom';

    const element = document.createElement('div');
    element.className = 'ol-unselectable ol-control ol-control-custom-container';
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener('click', this.handleClick.bind(this), false);
  }

  handleClick() {
    const view = this.getMap()?.getView();
    if (!view) return;

    // If geolocation exists, stop tracking before creating a new one
    if (this.geolocation) {
      this.geolocation.setTracking(false);
      this.geolocation = null;
    }
    
    // Create new geolocation instance
    this.geolocation = new Geolocation({
      tracking: true,
      trackingOptions: {
        enableHighAccuracy: true
      },
      projection: view.getProjection()
    });

    // One-time position change listener
    const positionListener = () => {
      const coordinates = this.geolocation?.getPosition();
      if (coordinates) {
        view.animate({
          center: coordinates,
          zoom: 15
        });
        // Stop tracking and remove listener after centering
        if (this.geolocation) {
          this.geolocation.setTracking(false);
          this.geolocation.un('change:position', positionListener);
        }
      }
    };

    this.geolocation.once('change:position', positionListener);
  }
}

interface BaseMapProps {
  className?: string;
  onMapInit: (map: Map) => void;
}

const BaseMap = ({ className = "h-[600px]", onMapInit }: BaseMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);

  // Milano coordinates
  const defaultPosition = fromLonLat([9.1900, 45.4642]);

  useEffect(() => {
    if (!mapRef.current) return;

    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      controls: defaultControls().extend([
        new GeolocationControl()
      ]),
      view: new View({
        center: defaultPosition,
        zoom: 12
      })
    });

    setMap(initialMap);
    onMapInit(initialMap);

    return () => {
      initialMap.setTarget(undefined);
    };
  }, [onMapInit]);

  return (
    <>
      <style>
        {`
          .ol-control-custom-container {
            top: 0.5em !important;  /* Position at the top */
            right: 0.5em !important;  /* Position at the right */
            left: auto !important;  /* Reset any left positioning */
          }
          .ol-control-custom {
            background-color: rgba(255,255,255,0.4);
            border: none;
            border-radius: 2px;
            cursor: pointer;
            height: 1.7em;
            width: 1.7em;
            font-size: 1.14em;
            padding: 0;
            line-height: 1.7em;
          }
          .ol-control-custom:hover {
            background-color: rgba(255,255,255,0.6);
          }
        `}
      </style>
      <div ref={mapRef} className={cn("w-full", className)} />
    </>
  );
};

export default BaseMap;

