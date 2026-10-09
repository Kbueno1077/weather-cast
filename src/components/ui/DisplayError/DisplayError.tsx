import Search from "@/components/Search/Search";
import { switchClassNames } from "@/components/ui/switchStyles";
import { useWeatherStore } from "@/store/zustand";
import { Button, Switch } from "@heroui/react";
import { LuCloudOff, LuLocateFixed, LuRefreshCw } from "react-icons/lu";

const copy: Record<string, string> = {
  "Error fetching weather data":
    "The weather service is busy right now. Wait a bit, then try again.",
  "Rate limit reached. Please try again later.":
    "The weather service is busy right now. Wait a bit, then try again.",
  "Geolocation not supported":
    "This browser cannot share your location. Search for a city instead.",
  "Permission denied by browser":
    "Location access is blocked in the browser settings.",
  "Location permission denied":
    "Location access was denied. Enable it in the browser settings, or search for a city.",
  "Location information unavailable":
    "Your location could not be determined. Check the device location settings, or search for a city.",
  "Location request timed out":
    "Finding your location took too long. Check your connection and try again.",
  "Missing latitude or longitude":
    "This place has no coordinates. Try another search.",
  "Weather service is not configured":
    "The weather service key is missing on the server.",
  "Weather service request failed":
    "The weather service could not be reached. Check your connection and try again.",
};

const DisplayError = ({ error }: { error: string }) => {
  const locationPermission = useWeatherStore((state) => state.locationPermission);
  const setLocationPermission = useWeatherStore((state) => state.setLocationPermission);
  const needsPermission =
    error === "Permission denied by user" || error === "Location access is required";

  const handlePermission = async (enabled: boolean) => {
    if (!enabled) {
      setLocationPermission("denied");
      return;
    }

    try {
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });

      if (permission.state === "denied") {
        setLocationPermission("denied");
        return;
      }

      await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      setLocationPermission("accepted");
    } catch {
      setLocationPermission("denied");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] w-full flex-col items-center justify-center gap-8 py-10 sm:min-h-[calc(100vh-2.5rem)]">
      <div className="flex max-w-[550px] flex-col items-center gap-4 text-center">
        <span className="grid size-14 place-items-center rounded-2xl border border-line bg-primary text-accent">
          <LuCloudOff aria-hidden="true" size={26} />
        </span>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl">
          Weather could not be loaded
        </h1>
        <p className="text-base text-balance">
          {needsPermission
            ? error === "Location access is required"
              ? "Allow location access for local weather, or search for a city."
              : "Location access is denied. Turn it on to load local weather, or search for a city."
            : copy[error] ?? error}
        </p>
      </div>

      <div className="flex w-full max-w-[550px] flex-col gap-4">
        <Search />
        {needsPermission && (
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-primary p-4">
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                <LuLocateFixed aria-hidden="true" size={18} />
              </span>
              <div className="flex flex-col gap-0.5">
                <h2 className="text-sm font-semibold text-primary-foreground">Location permission</h2>
                <p className="text-sm">Used only to find the weather where you are</p>
              </div>
            </div>
            <Switch
              isSelected={locationPermission === "accepted"}
              onValueChange={(selected) => {
                void handlePermission(selected);
              }}
              classNames={switchClassNames}
              aria-label="Location permission toggle"
            />
          </div>
        )}
      </div>

      <Button
        radius="full"
        className="w-full bg-accent font-medium text-white sm:w-[220px]"
        startContent={<LuRefreshCw aria-hidden="true" size={15} />}
        onPress={() => window.location.reload()}
      >
        Try again
      </Button>
    </div>
  );
};

export default DisplayError;
