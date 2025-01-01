import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import Divider from "@/components/ui/Divider/Divider";

function SettingsSide() {
  return (
    <div className="flex flex-col gap-4 w-full mt-11">
      <BoxWrapper className="w-full">
        <>
          <h2 className="text-primary-foreground font-bold text-3xl mb-5">
            Advanced
          </h2>

          <Divider />

          <div className="mt-5 ">
            <h3 className="text-primary-foreground text-xl">
              Get new experiences
            </h3>

            <div className="mt-3">
              <p>- Real-time weather updates</p>
              <p>- Multiple city tracking</p>
              <p>- 3-day weather forecast</p>
              <p>- Customizable units </p>
            </div>
          </div>

          <div className="bg-[#38455C] mt-5 rounded-2xl flex items-center justify-center px-5 py-5">
            <div className="flex">
              <h2 className="font-bold text-primary-foreground text-3xl">
                $0.00
              </h2>
              <p className="self-end ml-0.5">/month</p>
            </div>
          </div>
        </>
      </BoxWrapper>

      <BoxWrapper className="w-full">
        <>
          <div className="mb-5 ">
            <h3 className="text-primary-foreground text-xl">
              Never forget your umbrella
            </h3>
          </div>

          <Divider />

          <p className="mt-5">
            Check the app regularly to stay up-to-date with the latest weather
            conditions
          </p>
        </>
      </BoxWrapper>
    </div>
  );
}

export default SettingsSide;
