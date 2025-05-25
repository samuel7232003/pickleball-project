import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import SearchBox from "./SearchBox";
import { getAllCourtService } from "../../services/court";
import navigateToPage from "../../config/navigate";
import { pages } from "../../router";
import { useNavigate } from "react-router-dom";

export default function Mapbox(props: any) {
  const {
    styleMap = "mapbox://styles/mapbox/streets-v12",
    projectionMap = "globe",
    zoomMap = 1,
    centerMap = [30, 15],
    mapMainElement,
    initialCenter = [108.2208, 16.0471],
    initialZoom = 12,
  } = props;

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const navigate = useNavigate();

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

    map.flyTo({
      center: [initialCenter[0], initialCenter[1]],
      zoom: initialZoom,
    });
    setMapInstance(map);
    return () => map.remove();
  }, []);

  const handleChoiceCourt = (id: string) => {
    navigate(navigateToPage(pages.DETAIL_COURT_PAGE, id));
  };

  const createPopupContent = (
    item: any,
    onDetailClick: (id: string) => void
  ): HTMLElement => {
    const container = document.createElement("div");

    const title = document.createElement("h3");
    title.textContent = item.name;

    const location = document.createElement("p");
    location.textContent = item.location;

    const button = document.createElement("button");
    button.textContent = "Xem chi tiết";
    button.style.marginTop = "8px";
    button.onclick = () => onDetailClick(item._id);

    container.appendChild(title);
    container.appendChild(location);
    container.appendChild(button);

    return container;
  };

  useEffect(() => {
    const fetchAllCourt = async () => {
      const data = await getAllCourtService();
      if (data.length > 0) {
        data.forEach((item: any) => {
          const { lat, lng } = item;
          new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .setPopup(
              new mapboxgl.Popup().setDOMContent(
                createPopupContent(item, handleChoiceCourt)
              )
            )
            .addTo(mapInstance!);
        });
      }
    };
    if (mapInstance) {
      mapInstance.on("load", () => {
        fetchAllCourt();
      });
    }
  }, [mapInstance]);

  const handleAddressSelect = (lng: number, lat: number) => {
    if (mapInstance) {
      mapInstance.flyTo({ center: [lng, lat], zoom: 7 });
    }
  };

  const handleCourtSelect = (lng: number, lat: number) => {
    if (mapInstance) {
      mapInstance.flyTo({ center: [lng, lat], zoom: 16 });
      const listMarker = mapInstance._markers;
      listMarker.forEach((marker: any) => {
        const { lng: _lng, lat: _lat } = marker._lngLat;
        if (_lng == lng && _lat == lat) {
          marker.togglePopup();
        }
      });
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
          isSearchOnMap={false}
          handleCourtSelect={handleCourtSelect}
        />
      </div>
    </div>
  );
}
