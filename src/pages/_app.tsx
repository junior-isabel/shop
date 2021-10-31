import type { AppProps /*, AppContext */ } from "next/app";
import Head from "next/head";
import "@vetixy/circular-std";
import "@fontsource/open-sans";
import "@fontsource/open-sans/600.css";
import "@fontsource/open-sans/700.css";
import "@assets/main.css";
import "react-toastify/dist/ReactToastify.css";
import { UIProvider } from "@contexts/ui.context";
import { SearchProvider } from "@contexts/search.context";
import { CheckoutProvider } from "@contexts/checkout.context";
import ModalContainer from "@components/common/modal/modal-container";
import SidebarContainer from "@components/common/sidebar/sidebar-container";
import ErrorMessage from "@components/ui/error-message";
import { SettingsProvider } from "@contexts/settings.context";
import PageLoader from "@components/ui/page-loader/page-loader";
import { useSettingsQuery, fetchSettings } from "@data/settings/use-settings.query";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import { ReactQueryDevtools } from "react-query/devtools";
import { useEffect, useRef } from "react";
import Color from 'color';
import { ToastContainer } from "react-toastify";
import { CartProvider } from "@contexts/quick-cart/cart.context";
import Seo from "@components/ui/seo";
import { useSettings } from "@contexts/settings.context";




const Noop: React.FC = ({ children }) => <>{children}</>;

const AppSettings: React.FC = (props) => {
  const { data, isLoading: loading, error } = useSettingsQuery();
  if (loading) return <PageLoader />;
  if (error) return <ErrorMessage message={error.message} />;
  return <SettingsProvider initialValue={data?.settings?.options} {...props} />;
};

export default function CustomApp({ Component, pageProps }: AppProps) {
  const queryClientRef = useRef<any>(null);
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }
  useEffect(() => {
    // alterar o tema do site.
    fetchSettings().then((res: any) => res.settings.options.site).then((data: {color: any}) => {
      const color = Color(data.color).darken(0.5);
      
      document.documentElement.style.setProperty('--gossamer-600', color);
      document.documentElement.style.setProperty('--gossamer-500', data.color);

      /*
      const colorBg = Color(data.color).lighten(0.9).fade(0.9);
      document.querySelector('.min-h-full')?.setAttribute('style', 'background-color: '+colorBg+' !important');
      document.querySelector('.bg-gray-100')?.setAttribute('style', 'background-color: '+colorBg+' !important');
      */
       
    }) 
    
  },[])
  const Layout = (Component as any).Layout || Noop;
  const settings = useSettings();
  return (
    <QueryClientProvider client={queryClientRef.current}>
      <Hydrate state={pageProps.dehydratedState}>
        <AppSettings>
          <UIProvider>
            <CartProvider>
              <CheckoutProvider>
                <SearchProvider>
                  <Layout>
                  <Head>
                    <link rel="shortcut icon" href={settings?.seo?.ogImage?.thumbnail} type="image/x-icon" />
                  </Head>
                    <Seo />
                    <Component {...pageProps} />
                  </Layout>
                  <ToastContainer autoClose={2000} />
                  <ModalContainer />
                  <SidebarContainer />
                </SearchProvider>
              </CheckoutProvider>
            </CartProvider>
          </UIProvider>
        </AppSettings>
      </Hydrate>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
