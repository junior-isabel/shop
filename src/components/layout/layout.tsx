import Footer from "./footer";
import Navbar from "@components/layout/navbar/navbar";
import MobileNavigation from "./mobile-navigation";

const Layout: React.FC = ({ children }) => (
  <div className="min-h-screen flex flex-col transition-colors duration-150 bg-gray-100">
    <Navbar />
    <div className="flex-grow">{children}</div>
    <MobileNavigation search={false} />
    <div className="flex-grow">
      <div className="flex flex-col max-w-7xl w-full mx-auto py-5 px-5  xl:px-8 2xl:px-14">
        <hr />
      </div>
    </div>
    <Footer />
  </div>
);

export default Layout;
