import Search from "@/components/Search/Search";
import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import { useWeatherStore } from "@/store/zustand";
import { parseCoord } from "@/utils/utilities";
import { weatherDataFields } from "@/utils/weatherMaps";
import { Button } from "@heroui/react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { LuChevronDown, LuMap, LuRefreshCw } from "react-icons/lu";

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
        <BoxWrapper className="flex w-full items-center gap-3">
          <LuMap aria-hidden="true" size={18} />
          <p className="text-sm">Search for a city to open the weather map.</p>
        </BoxWrapper>
      ) : (
        <div className="flex min-h-0 w-full flex-1 flex-col gap-4 lg:flex-row">
          <BoxWrapper className="h-full min-h-[320px] w-full overflow-hidden p-2">
            <div ref={mapRef} className="h-full w-full rounded-2xl" />
          </BoxWrapper>

          <BoxWrapper className="flex w-full flex-col gap-4 self-start lg:w-72 lg:shrink-0">
            <div>
              <p className="eyebrow">Map layer</p>
              <p className="mt-1 font-display text-lg font-semibold text-primary-foreground">
                {selectedField.label}
              </p>
              {currentCity?.city && <p className="text-sm">Around {currentCity.city}</p>}
            </div>

            <label className="flex flex-col gap-2 text-xs font-medium">
              Data field
              <span className="relative">
                <select
                  className="h-11 w-full appearance-none rounded-xl border border-line bg-background/60 px-3 pr-9 text-sm text-primary-foreground transition-colors outline-none focus-visible:border-accent/60"
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
                <LuChevronDown
                  aria-hidden="true"
                  size={16}
                  className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
                />
              </span>
            </label>

            <Button
              radius="lg"
              className="bg-accent font-medium text-white"
              startContent={<LuRefreshCw aria-hidden="true" size={15} />}
              onPress={() => setRefreshKey((value) => value + 1)}
            >
              Update map
            </Button>
          </BoxWrapper>
        </div>
      )}
    </div>
  );
}
