import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import SearchBox from "./SearchBox";

export default function Mapbox(props: any) {
  const {
    styleMap = "mapbox://styles/mapbox/streets-v12",
    projectionMap = "globe",
    zoomMap = 1,
    centerMap = [30, 15],
    mapMainElement,
    initialCenter = [108.2208, 16.0471],
    initialZoom = 13,
  } = props;

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);

  

  useEffect(() => {
    const accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
    if (!accessToken || !mapContainerRef.current) {
      console.error("Mapbox access token is missing or container not found");
      return;
    }

    mapboxgl.accessToken = accessToken;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: styleMap,
      projection: projectionMap,
      zoom: zoomMap,
      center: centerMap,
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.scrollZoom.disable();
    map.on("style.load", () => map.setFog({}));

    map.flyTo({ center: [initialCenter[0], initialCenter[1]], zoom: initialZoom });

    setMapInstance(map);
    return () => map.remove();
  }, []);

  const handleAddressSelect = (lng: number, lat: number) => {
    if (mapInstance) {
      mapInstance.flyTo({ center: [lng, lat], zoom: 7 });
      new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapInstance);
    }
  };

  return (
    <div className={mapMainElement}>
      <div
        id="map"
        ref={mapContainerRef}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 10,
        }}
      >
        <SearchBox
          onAddressSelect={handleAddressSelect}
        />
      </div>
    </div>
  );
}
