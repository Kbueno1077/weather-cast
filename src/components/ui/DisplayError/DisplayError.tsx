import Search from "@/components/Search/Search";
import { useWeatherStore } from "@/store/zustand";
import { Button, Switch } from "@heroui/react";

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
    <div className="h-screen w-full flex sm:justify-center items-center flex-col gap-10">
      <h1 className="text-3xl font-bold text-primary-foreground">
        Weather could not be loaded
      </h1>

      <div className="w-full max-w-[550px] flex flex-col gap-6">
        <Search />
        {needsPermission ? (
          <div className="flex flex-col gap-4">
            <p className="text-2xl">
              {error === "Location access is required"
                ? "Allow location access for local weather, or search for a city."
                : "Location access is denied. Turn it on to load local weather, or search for a city."}
            </p>
            <div className="flex justify-between items-center p-4 bg-content1 rounded-lg">
              <div className="flex flex-col gap-1">
                <h2 className="font-bold text-primary-foreground">Location permission</h2>
                <p className="text-sm text-default-500">
                  Used only to find the weather where you are
                </p>
              </div>
              <Switch
                isSelected={locationPermission === "accepted"}
                onValueChange={(selected) => {
                  void handlePermission(selected);
                }}
                color="success"
                aria-label="Location permission toggle"
              />
            </div>
          </div>
        ) : (
          <p className="text-2xl">
            {copy[error] ?? error}
          </p>
        )}
      </div>

      <Button
        fullWidth
        variant="flat"
        color="warning"
        className="w-full sm:w-[220px]"
        onPress={() => window.location.reload()}
      >
        Try again
      </Button>
    </div>
  );
};

export default DisplayError;
