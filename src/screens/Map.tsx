import { Loading } from "@/components/ui/Loading/Loading";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

export default function Map() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_WHEATHER_API_KEY;

  const weatherDataFields = [
    "temperature",
    "temperatureApparent",
    "dewPoint",
    "humidity",
    "windSpeed",
    "windDirection",
    "windGust",
    "pressureSurfaceLevel",
    "pressureSeaLevel",
    "precipitationIntensity",
    "rainIntensity",
    "freezingRainIntensity",
    "snowIntensity",
    "sleetIntensity",
    "precipitationProbability",
    "precipitationType",
    "rainAccumulation",
    "snowAccumulation",
    "snowAccumulationLwe",
    "snowDepth",
    "sleetAccumulation",
    "sleetAccumulationLwe",
    "iceAccumulationS",
    "iceAccumulationLwe",
    "sunriseTime",
    "sunsetTime",
    "visibility",
    "cloudCover",
    "cloudBase",
    "cloudCeiling",
    "moonPhase",
    "uvIndex",
    "uvHealthConcern",
    "gdd10To30",
    "gdd10To31",
    "gdd08To30",
    "gdd03To25",
    "weatherCodeFullDay",
    "weatherCodeDay",
    "weatherCodeNight",
    "weatherCode",
    "thunderstormProbability",
    "ezHeatStressIndex",
  ];

  const DATA_FIELD = weatherDataFields[10];
  const TIMESTAMP = new Date().toISOString();

  if (isLoading) return <Loading />;

  if (error) {
    return <div className="text-red-500 p-4">Error loading map: {error}</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[600px] w-full">
      <MapContainer
        center={[42.355438, -71.059914]}
        zoom={7}
        minZoom={3}
        maxZoom={10}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <TileLayer
          attribution='&copy; <a href="https://www.tomorrow.io/weather-api">Powered by Tomorrow.io</a>'
          url={`https://api.tomorrow.io/v4/map/tile/{z}/{x}/{y}/${DATA_FIELD}/${TIMESTAMP}.png?apikey=${API_KEY}`}
        />
      </MapContainer>
    </div>
  );
}
