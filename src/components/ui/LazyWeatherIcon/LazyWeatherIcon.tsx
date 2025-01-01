import { useState, useEffect } from "react";
import { weatherIconPaths, WeatherIconName } from "@/utils/weatherIcons";

interface LazyWeatherIconProps {
  name: WeatherIconName;
  className?: string;
  alt?: string;
}

export default function LazyWeatherIcon({
  name,
  className = "",
  alt = "weather icon",
}: LazyWeatherIconProps) {
  const [iconUrl, setIconUrl] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    const loadIcon = async () => {
      try {
        const module = await weatherIconPaths[name]();
        if (mounted) {
          setIconUrl(module.default);
        }
      } catch (error) {
        console.error(`Failed to load icon: ${name}`, error);
        // Load fallback icon if the requested one fails
        if (mounted && name !== "not-available") {
          const fallback = await weatherIconPaths["not-available"]();
          setIconUrl(fallback.default);
        }
      }
    };

    loadIcon();

    return () => {
      mounted = false;
    };
  }, [name]);

  if (!iconUrl) {
    return <div className={`animate-pulse bg-gray-200 ${className}`} />;
  }

  return <img src={iconUrl} alt={alt} className={className} loading="lazy" />;
}
