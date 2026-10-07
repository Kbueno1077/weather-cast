import Search from "@/components/Search/Search";
import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import { useWeatherStore } from "@/store/zustand";
import { parseCoord } from "@/utils/utilities";
import { weatherDataFields } from "@/utils/weatherMaps";
import { Button } from "@heroui/react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";

export default function Map() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const weatherLayerRef = useRef<L.TileLayer | null>(null);
  const currentCity = useWeatherStore((state) => state.currentCity);
  const [selectedField, setSelectedField] = useState(weatherDataFields[0]);
  const [refreshKey, setRefreshKey] = useState(0);

  const latitude = parseCoord(currentCity?.latitude);
  const longitude = parseCoord(currentCity?.longitude);

  useEffect(() => {
    if (!mapRef.current || latitude == null || longitude == null) return;

    const map = L.map(mapRef.current, {
      center: [latitude, longitude],
      zoom: 8,
      scrollWheelZoom: true,
    });
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      weatherLayerRef.current = null;
    };
  }, [latitude, longitude]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedField) return;

    if (weatherLayerRef.current) {
      map.removeLayer(weatherLayerRef.current);
    }

    const layer = L.tileLayer(
      `/api/map-tile?z={z}&x={x}&y={y}&field=${encodeURIComponent(selectedField.key)}`,
      {
        attribution:
          '&copy; <a href="https://www.tomorrow.io/weather-api">Tomorrow.io</a>',
      }
    );
    layer.addTo(map);
    weatherLayerRef.current = layer;
  }, [selectedField, latitude, longitude, refreshKey]);

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-8rem)] sm:h-[calc(100vh-2rem)] w-full">
      <Search />

      {latitude == null || longitude == null ? (
        <BoxWrapper className="w-full">
          <p>Search for a city to open the weather map.</p>
        </BoxWrapper>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 min-h-0 flex-1 w-full">
          <BoxWrapper className="h-full w-full min-h-[320px]">
            <div ref={mapRef} className="h-full w-full rounded-lg" />
          </BoxWrapper>

          <div className="flex flex-col gap-4 w-full lg:w-72 lg:shrink-0 self-start">
            <label className="flex flex-col gap-2 text-sm">
              Data field
              <select
                className="bg-primary text-primary-foreground rounded-xl border border-white/15 px-3 py-2"
                value={selectedField.key}
                onChange={(event) => {
                  const selected = weatherDataFields.find(
                    (field) => field.key === event.target.value
                  );
                  if (selected) setSelectedField(selected);
                }}
              >
                {weatherDataFields.map((field) => (
                  <option key={field.key} value={field.key}>
                    {field.label}
                  </option>
                ))}
              </select>
            </label>

            <Button color="primary" onPress={() => setRefreshKey((value) => value + 1)}>
              Update map
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
