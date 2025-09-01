declare module 'leaflet.heat' {
  import * as L from 'leaflet';
  
  declare module 'leaflet' {
    namespace HeatLayer {
      interface HeatLayerOptions {
        minOpacity?: number;
        maxZoom?: number;
        max?: number;
        radius?: number;
        blur?: number;
        gradient?: { [key: number]: string };
      }
    }
    
    function heatLayer(latlngs: any[], options?: HeatLayer.HeatLayerOptions): L.Layer;
  }
}