import NavbarWithSearch from "@components/layout/navbar/navbar-with-search";
import MobileNavigation from "./mobile-navigation";
import Footer from "./footer";
const HomeLayout: React.FC = ({ children }) => (
  <div className="flex flex-col min-h-screen transition-colors duration-150">
    <NavbarWithSearch />
    {children}
    <MobileNavigation />
    <Footer />
  </div>
);

export default HomeLayout;
