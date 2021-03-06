
import { useRouter } from "next/router";

import { scroller, Element } from "react-scroll";
import { QueryClient } from "react-query";

import dynamic from "next/dynamic";
import Banner from "@components/common/banner";
import HomeLayout from "@components/layout/home-layout";
import PromotionSlider from "@components/common/promotion-slider";
import ProductFeed from "@components/product/feed";
import CategoryDropdownSidebar from "@components/category/category-dropdown-sidebar";
import FilterBar from "@components/common/filter-bar";
import { useWindowSize } from "@utils/use-window-size";
import { sitePages, PageName } from "@settings/site-pages.settings";
import { getKeyValue } from "@utils/get-key-value";
import { fetchProducts } from "@data/product/use-products.query";
import { fetchCategories } from "@data/category/use-categories.query";
import { fetchTypes } from "@data/type/use-types.query";
import React, { useEffect } from "react";


const CartCounterButton = dynamic(
  () => import("@components/cart/cart-counter-button"),
  { ssr: false }
);




export default function HomePage() {
    
  const { query } = useRouter();
  // !query.category && (query.category = 'fruits')



  

  
  useEffect(() => {
    if (query.text || query.category) {
      scroller.scrollTo("grid", {
        smooth: true,
        offset: -110,
      });
    }
  }, [query.text, query.category]);

  const { width } = useWindowSize();
  const PAGE_TYPE = "home";
  const getPageData = getKeyValue(sitePages, PAGE_TYPE as PageName);

  return (
    
    <>
      <Banner banner={getPageData?.banner} className="" />
      <PromotionSlider />
      <FilterBar />
      <Element
        name="grid"
        className="flex flex-1 border-t border-solid border-gray-200 border-opacity-70"
      >
        <CategoryDropdownSidebar />
        <main className="flex-1">
          <ProductFeed />
        </main>
      </Element>
      {width > 1023 && <CartCounterButton />}
    </>
  );
}

HomePage.Layout = HomeLayout;
