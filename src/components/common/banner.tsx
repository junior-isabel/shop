import Search from "@components/common/search";
import { useUI } from "@contexts/ui.context";
import { BannerType } from "@settings/site-pages.settings";
import { Waypoint } from "react-waypoint";
import cn from "classnames";

import { useSettings } from "@contexts/settings.context";



type BannerProps = {
  banner: BannerType;
  className?: string;
};
const Banner: React.FC<BannerProps> = ({ className }) => {
  const { showHeaderSearch, hideHeaderSearch } = useUI();
  const onWaypointPositionChange = ({
    currentPosition,
  }: Waypoint.CallbackArgs) => {
    if (!currentPosition || currentPosition === "above") {
      showHeaderSearch();
    }
  };
  const settings = useSettings();
  return (
    <div className={cn("hidden lg:block relative", className)}>
      <div className="min-h-140 overflow-hidden -z-1">

      <div className="min-h-140" style={{background: `url(${settings?.site?.image.original})`,backgroundSize:'cover',backgroundPosition:'center', opacity: (settings?.site?.opacity), width: '100%', height: 'auto' }}></div>


      </div>
      <div className="p-5 mt-8 absolute inset-0 w-full flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl xl:text-5xl tracking-tight text-heading font-bold mb-5 xl:mb-8">
          {settings?.site?.title}
        </h1>
        <p className="text-base xl:text-lg text-heading mb-10 xl:mb-14">
        {settings?.site?.subtitle}
        </p>
        <div className="max-w-3xl w-full">
          <Search label="grocery search" />
        </div>
        <Waypoint
          onLeave={showHeaderSearch}
          onEnter={hideHeaderSearch}
          onPositionChange={onWaypointPositionChange}
        />
      </div>
    </div>
  );
};

export default Banner;
