import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import { useWeatherStore } from "@/store/zustand";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Switch,
  useDisclosure,
  Divider,
} from "@nextui-org/react";
import { BsTrash3 } from "react-icons/bs";

function General() {
  const {
    locationPermission,
    setLocationPermission,
    unitSettings,
    changeSettingsUnit,
  } = useWeatherStore((state) => state);

  const handlePermission = async (isSelected: boolean) => {
    if (!isSelected) {
      setLocationPermission("denied");
      return;
    }

    try {
      const permission = await navigator.permissions.query({
        name: "geolocation" as PermissionName,
      });

      if (permission.state === "denied") {
        throw new Error("Location permission denied in browser settings");
      }

      await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, (error) => {
          reject(error);
        });
      });

      setLocationPermission("accepted");
    } catch (error) {
      setLocationPermission("denied");
      console.error("Location permission error:", error);
    }
  };

  return (
    <BoxWrapper title="General" className="w-full flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-primary-foreground">12-Hour Time</h2>
        </div>
        <Switch
          isSelected={unitSettings.is12Hour}
          onValueChange={() =>
            changeSettingsUnit("is12Hour", !unitSettings.is12Hour)
          }
          aria-label="Automatic updates"
          color="success"
        />
      </div>

      <Divider />

      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-primary-foreground">
            Location Permission
          </h2>
          <p className="text-sm text-default-500">
            Allow access to your location for local weather
          </p>
        </div>

        <Switch
          isSelected={locationPermission === "accepted"}
          onValueChange={handlePermission}
          color="success"
          aria-label="Location permission toggle"
        />
      </div>

      <Divider />

      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-primary-foreground">
            Remove all saved
          </h2>
        </div>

        <ConfirmDeleteModal />
      </div>
    </BoxWrapper>
  );
}

export default General;

function ConfirmDeleteModal() {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const { removeAll } = useWeatherStore();

  const handleRemoveAll = () => {
    removeAll();
    onClose();
  };

  return (
    <>
      <Button isIconOnly color="danger" onPress={onOpen}>
        <BsTrash3 size={20} />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete Confirmation
              </ModalHeader>
              <ModalBody>
                Are you sure you want to delete all saved data?
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>

                <Button color="primary" onPress={handleRemoveAll}>
                  Accept
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
