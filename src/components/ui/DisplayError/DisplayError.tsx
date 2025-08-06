import { Button, Switch } from "@nextui-org/react";
import { useWeatherStore } from "@/store/zustand";

const DisplayError = ({ error }: { error: string }) => {
  const { locationPermission, setLocationPermission } = useWeatherStore(
    (state) => state
  );

  const handlePermission = async () => {
    try {
      const permission = await navigator.permissions.query({
        name: "geolocation" as PermissionName,
      });

      if (permission.state === "denied") {
        throw new Error("Permission denied by browser");
      }

      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      setLocationPermission("accepted");
    } catch (error) {
      setLocationPermission(error.code);
      console.error("Location permission error:", error);
    }
  };

  return (
    <div className="h-screen w-full flex sm:justify-center items-center flex-col gap-10">
      <h1 className="text-3xl font-bold text-primary-foreground">
        Sorry, we could not load your information
      </h1>

      <div className="w-full max-w-[550px]">
        {error === "Error fetching weather data" && (
          <p className="text-2xl">
            Sorry, we encounter and issue loading information, it might have to
            due to the high traffic of data during the last hour as this is a
            small project not intended for large usage, try again within the
            next hour
          </p>
        )}

        {error === "Rate limit reached. Please try again later." && (
          <p className="text-2xl">
            Sorry, we encounter and issue loading information, it might have to
            due to the high traffic of data during the last hour as this is a
            small project not intended for large usage, try again within the
            next hour
          </p>
        )}

        {error === "Geolocation not supported" && (
          <p className="text-2xl">
            Geolocation is not supported by your browser. Please use a different
            browser or enable location access in your browser settings.
          </p>
        )}

        {error === "Permission denied by user" && (
          <div className="flex flex-col gap-4">
            <p className="text-2xl">
              Location permissions are denied. Enable location access to get
              local weather information.
            </p>
            <div className="flex justify-between items-center p-4 bg-content1 rounded-lg">
              <div className="flex flex-col gap-1">
                <h2 className="font-bold text-primary-foreground">
                  Location Permission
                </h2>
                <p className="text-sm text-default-500">
                  Allow access to your location for local weather and try again
                </p>
              </div>
              <Switch
                isSelected={locationPermission === "accepted"}
                onValueChange={handlePermission}
                color="success"
                aria-label="Location permission toggle"
              />
            </div>
          </div>
        )}

        {error === "Permission denied by browser" && (
          <p className="text-2xl">
            Location permission denied in browser settings
          </p>
        )}

        {error === "Location permission denied" && (
          <p className="text-2xl">
            Location access was denied. Please enable location permissions in
            your browser settings.
          </p>
        )}

        {error === "Location information unavailable" && (
          <p className="text-2xl">
            Unable to retrieve your location. Please check your device&apos;s
            location settings.
          </p>
        )}

        {error === "Location request timed out" && (
          <p className="text-2xl">
            Location request took too long. Please check your connection and try
            again.
          </p>
        )}

        {error === "Network response was not ok" && (
          <p className="text-2xl">
            There was a problem connecting to the weather service. Please check
            your internet connection and try again.
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
        Try Again
      </Button>
    </div>
  );
};

export default DisplayError;
