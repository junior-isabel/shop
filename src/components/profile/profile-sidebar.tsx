import cn from "classnames";
import NavLink from "@components/ui/link/nav-link";
import { siteSettings } from "@settings/site.settings";
type DashboardSidebarProps = {
  className?: string;
};

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ className }) => {
  return (
    <aside
      className={cn(
        "bg-white rounded border border-gray-200 overflow-hidden",
        className
      )}
    >
      <ul className="py-8">
        {siteSettings.dashboardSidebarMenu
          ?.slice(0, -1)
          .map((item: any, idx) => (
            <li className="py-2" key={idx}>
              <NavLink
                href={item.href}
                activeClassName="border-primary text-primary"
              >
                <a className="block py-2 px-10 font-semibold text-gray-800 transition-colors border-l-4 border-transparent hover:text-primary focus:text-primary">
                  {item.label}
                </a>
              </NavLink>
            </li>
          ))}
          
      </ul>
      {/* End of top part menu */}

      <ul className="bg-white border-t border-gray-200 py-4">
        {siteSettings.dashboardSidebarMenu?.slice(-1).map((item: any, idx) => (
          <li className="py-2" key={idx}>
            <NavLink
              href={item.href}
              activeClassName="border-l-4 border-primary text-primary"
            >
              <a className="block py-2 px-10 font-semibold text-gray-800 transition-colors hover:text-primary focus:text-primary">
                {item.label}
              </a>
            </NavLink>
          </li>
        ))}
      </ul>
      {/* End of bottom part menu */}
    </aside>
  );
};

export default DashboardSidebar;
