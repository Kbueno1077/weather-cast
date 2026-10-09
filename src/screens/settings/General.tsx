import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import { useWeatherStore } from "@/store/zustand";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  useDisclosure,
} from "@heroui/react";
import { LuTrash2 } from "react-icons/lu";
import { switchClassNames } from "@/components/ui/switchStyles";
import SettingRow from "./SettingRow";

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
    } catch {
      setLocationPermission("denied");
    }
  };

  return (
    <BoxWrapper title="General" className="w-full">
      <div className="divide-y divide-line">
        <SettingRow title="12-hour time" description="Show times like 2:00 PM instead of 14:00">
          <Switch
            isSelected={unitSettings.is12Hour}
            onValueChange={() => changeSettingsUnit("is12Hour", !unitSettings.is12Hour)}
            classNames={switchClassNames}
            aria-label="Use 12-hour time"
          />
        </SettingRow>

        <SettingRow
          title="Location permission"
          description="Allow access to your location for local weather"
        >
          <Switch
            isSelected={locationPermission === "accepted"}
            onValueChange={handlePermission}
            classNames={switchClassNames}
            aria-label="Location permission toggle"
          />
        </SettingRow>

        <SettingRow title="Remove all saved" description="Clear saved cities and the current city">
          <ConfirmDeleteModal />
        </SettingRow>
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
      <Button
        size="sm"
        radius="full"
        color="danger"
        variant="flat"
        className="shrink-0 font-medium"
        startContent={<LuTrash2 aria-hidden="true" size={15} />}
        onPress={onOpen}
      >
        Clear
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        classNames={{ base: "border border-line bg-primary", backdrop: "bg-background/60" }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="font-display text-xl font-semibold text-primary-foreground">
                Remove all saved data?
              </ModalHeader>
              <ModalBody className="text-sm text-foreground">
                This removes your saved cities and the current city. Your unit choices stay.
              </ModalBody>
              <ModalFooter>
                <Button variant="light" className="text-foreground" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" onPress={handleRemoveAll}>
                  Remove
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
