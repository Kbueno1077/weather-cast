import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import { Loading } from "@/components/ui/Loading/Loading";
import { useWeatherStore } from "@/store/zustand";
import { weatherDataFields } from "@/utils/weatherMaps";
import { Autocomplete, AutocompleteItem, Button } from "@nextui-org/react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";

export default function Map() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const weatherLayerRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedField, setSelectedField] = useState({
    key: "temperature",
    label: "Temperature",
  });

  const { currentCity } = useWeatherStore((state) => state);
  const API_KEY = import.meta.env.VITE_WHEATHER_API_KEY;

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || !currentCity) return;

    const { latitude, longitude } = currentCity;

    // Create map instance
    mapInstanceRef.current = L.map(mapRef.current, {
      center: [latitude, longitude],
      zoom: 10,
      dragging: false,
      touchZoom: false,
      doubleClickZoom: false,
      scrollWheelZoom: false,
      boxZoom: false,
      keyboard: false,
      zoomControl: false,
    });

    // Add base tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstanceRef.current);

    // Initial weather layer load
    loadWeatherLayer();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [currentCity]);

  // Function to load weather layer
  const loadWeatherLayer = () => {
    if (!mapInstanceRef.current || !currentCity) return;

    setIsLoading(true);
    const timestamp = new Date().toISOString();

    // Remove existing weather layer if it exists
    if (weatherLayerRef.current) {
      mapInstanceRef.current.removeLayer(weatherLayerRef.current);
    }

    try {
      // Create new weather layer
      weatherLayerRef.current = L.tileLayer(
        `https://api.tomorrow.io/v4/map/tile/{z}/{x}/{y}/${selectedField.key}/${timestamp}.png?apikey=${API_KEY}`,
        {
          attribution:
            '&copy; <a href="https://www.tomorrow.io/weather-api">Powered by Tomorrow.io</a>',
        }
      ).addTo(mapInstanceRef.current);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle field selection change
  const handleFieldChange = (key) => {
    const selected = weatherDataFields.find((field) => field.key === key);
    if (selected) {
      setSelectedField(selected);
      loadWeatherLayer();
    }
  };

  if (error) {
    return <div className="text-red-500 p-4">Error loading map: {error}</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-8rem)] sm:h-[calc(100vh-2rem)] w-full">
      <BoxWrapper className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-8rem)] sm:h-[calc(100vh-2rem)] w-full">
        <div ref={mapRef} className="h-full w-full rounded-lg relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-[999]">
              <Loading />
            </div>
          )}
        </div>
      </BoxWrapper>

      <div className="flex flex-col gap-4 w-full lg:w-fit">
        <Autocomplete
          className="w-full lg:max-w-sm"
          defaultItems={weatherDataFields}
          label="Data Field"
          placeholder="Search a data field"
          defaultSelectedKey={selectedField.key}
          onSelectionChange={handleFieldChange}
        >
          {(item) => (
            <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
          )}
        </Autocomplete>

        <Button
          color="primary"
          className="w-full lg:max-w-sm"
          onPress={loadWeatherLayer}
        >
          Update Map
        </Button>
      </div>
    </div>
  );
}
